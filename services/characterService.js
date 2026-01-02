import sql from "mssql";
import { poolPromise } from "../db/connection.js";

// Helper to determine table name based on RF Online Table Code (from your PHP logic)
const getItemTable = (code) => {
    const tables = {
        0: "tbl_code_upper", 1: "tbl_code_lower", 2: "tbl_code_gauntlet",
        3: "tbl_code_shoe", 4: "tbl_code_helmet", 5: "tbl_code_shield",
        6: "tbl_code_weapon", 7: "tbl_code_cloak", 8: "tbl_code_ring",
        9: "tbl_code_amulet", 10: "tbl_code_bullet", 14: "tbl_code_potion" // etc
    };
    return tables[code] || "tbl_code_etc";
};

/** MODULE: Character Information */
export const getCharacterInfo = async (name) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("name", sql.VarChar, name)
        .query(`
            SELECT B.*, G.GuildSerial, G.id as GuildName, P.pvp_point, P.pvp_cash
            FROM tbl_base B
            LEFT JOIN tbl_general GE ON B.Serial = GE.Serial
            LEFT JOIN tbl_guild G ON GE.GuildSerial = G.Serial
            LEFT JOIN tbl_pvporderview P ON B.Serial = P.serial
            WHERE B.Name = @name AND B.DCK = 0
        `);
    return result.recordset[0];
};

/** MODULE: Equipment */
export const getEquipmentModule = async (characterSerial, baseData) => {
    const pool = await poolPromise;
    // This logic mimics your PHP UNION query but simplified for Node
    // You would loop through EK0-EK7 and ED0-ED5 from your baseData
    const equipment = {
        armor: baseData.EK0, // Simplified for brevity
        weapon: baseData.EK6,
    };
    return equipment;
};

/** MODULE: Inventory */
export const getInventoryModule = async (characterSerial) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("serial", sql.Int, characterSerial)
        .query(`SELECT * FROM tbl_inven WHERE Serial = @serial`);
    
    const rawInven = result.recordset[0];
    const items = [];

    for (let i = 0; i < 100; i++) {
        const kVal = rawInven[`K${i}`];
        if (kVal && kVal !== -1) {
            const itemId = Math.floor(kVal / 65536);
            const tableCode = Math.floor((kVal - (itemId * 65536)) / 256);
            const tableName = getItemTable(tableCode);

            // Fetch name/icon from Items DB
            const itemQuery = await pool.request()
                .query(`SELECT item_name, Icon FROM ${tableName} WHERE item_id = ${itemId}`);
            
            items.push({
                slot: i,
                name: itemQuery.recordset[0]?.item_name || "Unknown",
                icon: itemQuery.recordset[0]?.Icon,
                qty: rawInven[`D${i}`]
            });
        }
    }
    return items;
};

/** MODULE: Bank */
export const getBankModule = async (accountSerial) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("accSerial", sql.Int, accountSerial)
        .query(`SELECT * FROM tbl_AccountTrunk WHERE AccountSerial = @accSerial`);
    return result.recordset[0] || { message: "Bank Empty" };
};