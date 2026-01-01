import express from "express";
import sql from "mssql";
import { poolPromise } from "../db/connection.js";

const router = express.Router();

router.get("/account-info/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await poolPromise;

        // One request, multiple recordsets to fetch all data at once
        const result = await pool.request()
            .input("user", sql.VarChar, username)
            .query(`
                -- 1. Get Core Account info and get the Serial (AccountSerial)
                SELECT 
                    Serial,
                    CAST(id AS VARCHAR) as username, 
                    Email, 
                    lastlogintime, 
                    lastloginip 
                FROM RF_User.dbo.tbl_rfaccount 
                WHERE id = CONVERT(BINARY(13), @user);

                -- 2. Get Billing info (PHP Logic)
                SELECT 
                    Cash, 
                    DTEndPrem, 
                    [Status]
                FROM BILLING.dbo.tbl_UserStatus 
                WHERE id = CONVERT(BINARY(13), @user);

                -- 3. Get Character List from RF_World using tbl_base (Your PHP Logic)
                -- We use a subquery to find the AccountSerial based on the username provided
                SELECT 
                    Serial, 
                    Name, 
                    Level, 
                    [Class], 
                    Race, 
                    MapCode,
                    LastConnTime
                FROM RF_World.dbo.tbl_base 
                WHERE DCK = 0 
                AND AccountSerial = (
                    SELECT Serial FROM RF_User.dbo.tbl_rfaccount WHERE id = CONVERT(BINARY(13), @user)
                )
                ORDER BY LastConnTime DESC;
            `);

        // Check if account exists in tbl_rfaccount
        if (result.recordsets[0].length === 0) {
            return res.status(404).json({ 
                status: 404, 
                message: "Account not found", 
                data: null 
            });
        }

        const accountBase = result.recordsets[0][0];
        const billingData = result.recordsets[1][0] || null;
        const characters = result.recordsets[2];

        // Format the final response
        const formattedData = {
            username: accountBase.username,
            account_serial: accountBase.Serial,
            last_login: accountBase.lastlogintime,
            ip_address: accountBase.lastloginip,
            game_point: 0, 
            cash_coin: billingData ? billingData.Cash : 0,
            DTEndPrem: billingData ? billingData.DTEndPrem : new Date(),
            status: (billingData && billingData.Status === 2) ? "Active" : "Inactive",
            characters: characters // Returns all chars found in tbl_base
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