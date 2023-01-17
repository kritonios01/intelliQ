const { Parser } = require('json2csv');

const pool = require(`../services/database`);
const errors = require(`../errors`);
const config = require(`../config`);

exports.healthcheck = async (req, res, next) => {
    let conn, resdata;

    try {
        conn = await pool.getConnection();
        const version = (await conn.query(`SELECT VERSION() AS version;`))[0].version;

        resdata = {
            status: "OK",
            dbconnection: version
        };
    } catch(err) {
        resdata = {
            status: "failed",
            dbconnection: "na"
        };
    } finally {
        if(req.query.format == `csv`) {
            const parser = new Parser(Object.keys(resdata));

            res.type(`text/csv`);
            res.send(parser.parse(resdata));
        } else {
            res.status(200).json(resdata);
        }

        if(conn) conn.end();
    }
};

exports.questionnaire_upd = async (req, res, next) => {
    if(!req.file) {
        return next(new errors.UsageError(`Missing multipart/form-data 'file' field`, 400));
    }

    if(req.file.mimetype != `application/json`) {
        return next(new errors.UsageError(`Unsupported file mimetype (accepted: application/json)`, 400));
    }

    let reqdata;

    try {
        reqdata = JSON.parse(req.file.buffer.toString(`UTF8`));
    } catch(err) {
        return next(new errors.UsageError(`Invalid JSON data`, 400));
    }

    let conn, resdata;

    try {
        conn = await pool.getConnection();

        await conn.query(`
            INSERT INTO questionnaires
            (questionnaireID, questionnaireTitle)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
              questionnaireTitle = ?;`,
        [reqdata.questionnaireID, reqdata.questionnaireTitle, reqdata.questionnaireTitle]);

        resdata = {
            status: "OK"
        };
    } catch(err) {
        return next(err);
    } finally {
        if(req.query.format == `csv`) {
            const parser = new Parser(Object.keys(resdata));

            res.type(`text/csv`);
            res.send(parser.parse(resdata));
        } else {
            res.status(200).json(resdata);
        }

        if(conn) conn.end();
    }
};

exports.resetall = async (req, res, next) => {
    let conn, resdata;

    try {
        conn = await pool.getConnection();

        await conn.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE answers;
            TRUNCATE TABLE sessions;
            TRUNCATE TABLE options;
            TRUNCATE TABLE questions;
            TRUNCATE TABLE questionnaire_keywords;
            TRUNCATE TABLE questionnaires;
            TRUNCATE TABLE keywords;

            SET FOREIGN_KEY_CHECKS = 1;
        `);

        resdata = {
            status: "OK"
        };
    } catch(err) {
        return next(err);
    } finally {
        if(req.query.format == `csv`) {
            const parser = new Parser(Object.keys(resdata));

            res.type(`text/csv`);
            res.send(parser.parse(resdata));
        } else {
            res.status(200).json(resdata);
        }

        if(conn) conn.end();
    }
};

exports.resetq = async (req, res, next) => {
    if(!req.params.questionnaireID) {
        return next(new errors.UsageError(`Missing parameter: questionnaireID`, 400));
    }

    let conn, resdata;

    try {
        conn = await pool.getConnection();

        await conn.query(`DELETE FROM answers WHERE questionnaireID = ?;`, [req.params.questionnaireID]);

        resdata = {
            status: "OK"
        };
    } catch(err) {
        return next(err);
    } finally {
        if(req.query.format == `csv`) {
            const parser = new Parser(Object.keys(resdata));

            res.type(`text/csv`);
            res.send(parser.parse(resdata));
        } else {
            res.status(200).json(resdata);
        }

        if(conn) conn.end();
    }
};