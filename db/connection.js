import sql from "mssql";
import "dotenv/config";

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: "RF_User", // Default starting point
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: { max: 20, min: 0, idleTimeoutMillis: 30000 }
};

export const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("✅ SQL Pool Ready (Accessing: User, World, Billing, Zee)");
        return pool;
    })
    .catch(err => {
        console.error("❌ SQL Connection Failed:", err);
        process.exit(1);
    });