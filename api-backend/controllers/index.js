const APIError = require("../utils/APIError");
const pool = require("../services/database");

module.exports.healthcheck = async (req, res, next) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const version = (await conn.query("SELECT VERSION() AS version"))[0].version;

        res.status(200).json({
            status: "OK",
            dbconnection: version
        });
    } catch(err) {
        res.status(200).json({
            status: "failed",
            dbconnection: "na"
        });

        return next(new APIError(err))
    } finally {
        if(conn) conn.end();
    }
};