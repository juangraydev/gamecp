import express from "express";
import sql from "mssql";
import { poolPromise } from "../db/connection.js";

const router = express.Router();

router.get("/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .query(`
                SELECT TOP 1 
                    Serial, 
                    RTRIM(Name) as Name, 
                    Level, 
                    Race, 
                    [Class], 
                    MapCode, 
                    DCK
                FROM RF_World.dbo.tbl_base 
                WHERE Name = @name
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ status: 404, message: "Player not found" });
        }

        res.json({ status: 200, data: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

export default router;