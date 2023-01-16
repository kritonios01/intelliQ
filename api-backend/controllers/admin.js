const errors = require("../errors");
const pool = require("../services/database");
const config = require('../config');

exports.healthcheck = async (req, res, next) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const version = (await conn.query(`SELECT VERSION() AS version`))[0].version;

        res.status(200).json({
            status: "OK",
            dbconnection: version
        });
    } catch(err) {
        res.status(200).json({
            status: "failed",
            dbconnection: "na"
        });
    } finally {
        if(conn) conn.end();
    }
};

exports.questionnaire_upd = async (req, res, next) => {
    let conn;

    try {
        conn = await pool.getConnection({multipleStatements: true});

        await conn.query(`
            INSERT INTO questionnaires
            (questionnaireID, questionnaireTitle)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE;`, req.body.questionnaireID, req.body.questionnaireTitle);

        res.status(200).json({
            status: "OK"
        });
    } catch(err) {
        return next(err);
    } finally {
        if(conn) conn.end();
    }
};

exports.resetall = async (req, res, next) => {
    let conn;

    try {
        conn = await pool.getConnection({multipleStatements: true});

        await conn.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            SELECT @str := CONCAT('TRUNCATE TABLE ', table_schema, '.', table_name, ';')
            FROM   information_schema.tables
            WHERE  table_type   = 'BASE TABLE'
            AND    table_schema = ?;

            PREPARE stmt FROM @str;

            EXECUTE stmt;

            DEALLOCATE PREPARE stmt;

            SET FOREIGN_KEY_CHECKS = 1;
        `, config.mariadb.database);

        res.status(200).json({
            status: "OK"
        });
    } catch(err) {
        return next(err);
    } finally {
        if(conn) conn.end();
    }
};

exports.resetq = async (req, res, next) => {
    if(!req.params.questionnaireID) {
        return next(new errors.UsageError(`Missing parameter: questionnaireID`, 400));
    }

    let conn;

    try {
        conn = await pool.getConnection();

        await conn.query(`DELETE FROM answers WHERE questionnaireID = ?;`, req.params.questionnaireID);

        res.status(200).json({
            status: "OK"
        });
    } catch(err) {
        return next(err);
    } finally {
        if(conn) conn.end();
    }
};