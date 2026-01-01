import express from "express";
import sql from "mssql";
import { poolPromise } from "../db/connection.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await poolPromise;

        // 1. QUERY: Get Core Account info
        const accountResult = await pool.request()
            .input("user", sql.VarChar, username)
            .query(`
                SELECT 
                    Serial,
                    CAST(id AS VARCHAR) as username, 
                    Email, 
                    lastlogintime, 
                    lastloginip 
                FROM RF_User.dbo.tbl_UserAccount 
                WHERE id = CONVERT(BINARY(13), @user)
            `);

        // Check if account exists immediately
        if (accountResult.recordset.length === 0) {
            return res.status(404).json({ 
                status: 404, 
                message: "Account not found", 
                data: null 
            });
        }

        const accountBase = accountResult.recordset[0];
        const accountSerial = accountBase.Serial;

        // 2. QUERY: Get Billing info (Isolated query)
        const billingResult = await pool.request()
            .input("user", sql.VarChar, username)
            .query(`
                SELECT Cash, DTEndPrem, [Status]
                FROM BILLING.dbo.tbl_UserStatus 
                WHERE id = CONVERT(BINARY(13), @user)
            `);

        const billingData = billingResult.recordset[0] || null;

        // 3. QUERY: Get Character List using the Serial retrieved in step 1
        const characterResult = await pool.request()
            .input("serial", sql.Int, accountSerial)
            .query(`
                SELECT 
                    Serial, 
                    Name, 
                    Level, 
                    [Class], 
                    Race, 
                    MapCode,
                    LastConnTime
                FROM RF_World.dbo.tbl_base 
                WHERE DCK = 0 AND AccountSerial = @serial
                ORDER BY LastConnTime DESC
            `);

        // Format final response object
        const formattedData = {
            username: accountBase.username,
            account_serial: accountSerial,
            last_login: accountBase.lastlogintime,
            ip_address: accountBase.lastloginip,
            game_point: 0, 
            cash_coin: billingData ? billingData.Cash : 0,
            DTEndPrem: billingData ? billingData.DTEndPrem : new Date(),
            status: (billingData && billingData.Status === 2) ? "Active" : "Inactive",
            characters: characterResult.recordset
        };

        return res.status(200).json({
            status: 200,
            message: "Account information retrieved successfully",
            data: formattedData
        });

    } catch (err) {
        console.error("Account Info Error:", err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null
        });
    }
});

export default router;