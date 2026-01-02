import express from "express";
import sql from "mssql";
import { poolPromise } from "../db/connection.js";

const router = express.Router();

/**
 * --- REGISTER ENDPOINT ---
 * Standard: 200 Success, 409 Conflict, 400 Validation, 500 Internal
 */
router.post("/register", async (req, res) => {
    const { username, password, email, pin } = req.body;
    const userIP = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'; // Capture IP

    if (!username || !password || !pin) {
        return res.status(400).json({
            status: 400,
            message: "Username, Password, and PIN are required",
            data: null
        });
    }

    try {
        const pool = await poolPromise;
        
        // 1. Check if Account already exists
        const check = await pool.request()
            .input("username", sql.VarChar, username)
            .query(`
                SELECT id FROM RF_User.dbo.tbl_rfaccount 
                WHERE id = convert(binary, @username)
            `);

        if (check.recordset.length > 0) {
            return res.status(409).json({
                status: 409,
                message: "Account already exists",
                data: null
            });
        }

        // 2. Insert into RF_User (Account Table)
        await pool.request()
            .input("id", sql.VarChar, username)
            .input("pw", sql.VarChar, password)
            .input("email", sql.VarChar, email || "")
            .input("pin", sql.VarChar, pin)
            .query(`
                INSERT INTO RF_User.dbo.tbl_rfaccount ([id], [password], [accounttype], [birthdate], [Email], [pin]) 
                VALUES (convert(binary, @id), convert(binary, @pw), 0, GETDATE(), @email, @pin)
            `);

        // 3. Insert into tbl_UserAccount (Audit/Log Table)
        await pool.request()
            .input("username", sql.VarChar, username)
            .input("ip", sql.VarChar, userIP)
            .query(`
                INSERT INTO RF_User.dbo.tbl_UserAccount (id, createtime, createip)
                VALUES (CONVERT(binary, @username), GETDATE(), @ip)
            `);

        // 4. Insert into Billing (Premium/Cash Table)
        // Note: Adding 3 days to GETDATE() for Premium end
        await pool.request()
            .input("username", sql.VarChar, username)
            .query(`
                INSERT INTO BILLING.dbo.tbl_UserStatus (Id, Status, DTStartPrem, DTEndPrem, Cash)
                VALUES (CONVERT(binary, @username), '2', GETDATE(), DATEADD(day, 3, GETDATE()), 0)
            `);

        return res.status(200).json({
            status: 200,
            message: "Account registered successfully and billing initialized",
            data: { username }
        });

    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null
        });
    }
});

/**
 * --- LOGIN ENDPOINT ---
 * Standard: 200 Success, 401 Unauthorized, 500 Internal
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({
            status: 401,
            message: "Username and Password are required",
            data: null
        });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("user", sql.VarChar, username)
            .input("pw", sql.VarChar, password)
            .query(`
                SELECT 
                    CAST(id AS VARCHAR) as username, 
                    Email, 
                    accounttype
                FROM RF_User.dbo.tbl_rfaccount 
                WHERE id = convert(binary, @user) 
                  AND password = convert(binary, @pw)
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                status: 401,
                message: "Invalid username or password",
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: result.recordset[0]
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null
        });
    }
});

/**
 * --- CHANGE PIN ENDPOINT ---
 */
router.post("/change-pin", async (req, res) => {
    const { username, currentPin, currentPassword, newPin } = req.body;

    if (!username || !currentPin || !currentPassword || !newPin) {
        return res.status(400).json({ status: 400, message: "All fields are required" });
    }

    try {
        const pool = await poolPromise;

        // 1. Verify current PIN and Password first
        const verify = await pool.request()
            .input("user", sql.VarChar, username)
            .input("pin", sql.VarChar, currentPin)
            .input("pw", sql.VarChar, currentPassword)
            .query(`
                SELECT id FROM RF_User.dbo.tbl_rfaccount 
                WHERE id = convert(binary, @user) 
                AND pin = @pin 
                AND password = convert(binary, @pw)
            `);

        if (verify.recordset.length === 0) {
            return res.status(401).json({ status: 401, message: "Invalid current PIN or Password" });
        }

        // 2. Update to new PIN
        await pool.request()
            .input("user", sql.VarChar, username)
            .input("newPin", sql.VarChar, newPin)
            .query(`
                UPDATE RF_User.dbo.tbl_rfaccount 
                SET pin = @newPin 
                WHERE id = convert(binary, @user)
            `);

        return res.status(200).json({ status: 200, message: "PIN changed successfully" });

    } catch (err) {
        console.error("Change PIN Error:", err);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

/**
 * --- CHANGE PASSWORD ENDPOINT ---
 */
router.post("/change-password", async (req, res) => {
    const { username, currentPin, currentPassword, newPassword } = req.body;

    if (!username || !currentPin || !currentPassword || !newPassword) {
        return res.status(400).json({ status: 400, message: "All fields are required" });
    }

    try {
        const pool = await poolPromise;

        // 1. Verify credentials (PIN + Old PW)
        const verify = await pool.request()
            .input("user", sql.VarChar, username)
            .input("pin", sql.VarChar, currentPin)
            .input("pw", sql.VarChar, currentPassword)
            .query(`
                SELECT id FROM RF_User.dbo.tbl_rfaccount 
                WHERE id = convert(binary, @user) 
                AND pin = @pin 
                AND password = convert(binary, @pw)
            `);

        if (verify.recordset.length === 0) {
            return res.status(401).json({ status: 401, message: "Identity verification failed" });
        }

        // 2. Update to new Password
        await pool.request()
            .input("user", sql.VarChar, username)
            .input("newPw", sql.VarChar, newPassword)
            .query(`
                UPDATE RF_User.dbo.tbl_rfaccount 
                SET password = convert(binary, @newPw) 
                WHERE id = convert(binary, @user)
            `);

        return res.status(200).json({ status: 200, message: "Password updated successfully" });

    } catch (err) {
        console.error("Change Password Error:", err);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

export default router;