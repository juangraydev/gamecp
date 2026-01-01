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

    if (!username || !password || !pin) {
        return res.status(400).json({
            status: 400,
            message: "Username, Password, and PIN are required",
            data: null
        });
    }

    try {
        const pool = await poolPromise;
        
        // Check if Account already exists (Security: Parameterized)
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

        // Insert into RF_User (Security: Parameterized + Binary Conversion)
        await pool.request()
            .input("id", sql.VarChar, username)
            .input("pw", sql.VarChar, password)
            .input("email", sql.VarChar, email || "")
            .input("pin", sql.VarChar, pin)
            .query(`
                INSERT INTO RF_User.dbo.tbl_rfaccount (
                    [id], [password], [accounttype], [birthdate], [Email], [pin]
                ) 
                VALUES (
                    convert(binary, @id), 
                    convert(binary, @pw), 
                    0, 
                    GETDATE(), 
                    @email, 
                    @pin
                )
            `);

        return res.status(200).json({
            status: 200,
            message: "Account registered successfully",
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

export default router;