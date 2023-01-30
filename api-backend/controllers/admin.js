const { Parser } = require('json2csv');

const errors = require(`../errors`);
const pool = require(`../services/database`);

/*
    Endpoint Implementation
    Resource URL: /admin/healthcheck
    Supported Methods: GET

    Returns the status of the application's connection to the database
*/
exports.healthcheck = async (req, res, next) => {
    let conn, resdata;

    try {
        conn = await pool.getConnection();
        const status = (await conn.query(`
            SELECT
              SUBSTRING_INDEX(USER(), '@', -1) AS host,
              @@port AS port,
              SUBSTRING_INDEX(USER(), '@', 1) AS user,
              DATABASE() AS current_database;`))[0];

        resdata = {
            status: "OK",
            dbconnection: `${status.user}:${status.current_database}@${status.host}:${status.port}`
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

/*
    Endpoint Implementation
    Resource URL: /admin/questionnaire_upd
    Supported Methods: POST

    Creates or updates a questionnaire along with its questions and their options
    Accepts a JSON file encoded as multipart/form data for the questionnaire data
*/
exports.questionnaire_upd = async (req, res, next) => {
    if(!req.file) {
        return next(new errors.UsageError(`Missing multipart/form-data 'file' field`, 400));
    }

    if(req.file.mimetype != `application/json`) {
        return next(new errors.UsageError(`Unsupported file mimetype (allowed: application/json)`, 400));
    }

    let questionnaire;

    try {
        questionnaire = JSON.parse(req.file.buffer.toString(`UTF8`));
    } catch(err) {
        return next(new errors.UsageError(`JSON syntax error`, 400));
    }

    try {
        if(!(questionnaire.questionnaireID && questionnaire.questionnaireTitle && questionnaire.keywords && questionnaire.questions)) {
            return next(new errors.UsageError(`Invalid questionnaire data`, 400));
        }

        const qids = [];
        const nextqids = [];

        for(const q in questionnaire.questions) {
            const question = questionnaire.questions[q];

            if(!(question.qID && question.qtext && question.required && question.type && question.options)) {
                return next(new errors.UsageError(`Invalid questionnaire data: question ` + q + ` malformed`, 400));
            }

            qids.push(question.qID);

            for(const o in question.options) {
                const option = questionnaire.questions[q].options[o];

                if(!(option.optID && option.opttxt && option.nextqID)) {
                    return next(new errors.UsageError(`Invalid questionnaire data: option ` + o + ` of question ` + q + ` malformed`, 400));
                }

                if(option.nextqID != `-`) nextqids.push(option.nextqID);
            }
        }

        for(const nextqid in nextqids) {
            if(!qids.includes(nextqids[nextqid])) {
                return next(new errors.UsageError(`Invalid questionnaire data: foreign key checks failed`, 400));
            }
        }
    } catch(err) {
        return next(new errors.UsageError(`Invalid questionnaire data`, 400));
    }

    let conn, resdata;

    try {
        conn = await pool.getConnection();

        await conn.query(`
            SET
              @questionnaireID = ?,
              @questionnaireTitle = ?;

            INSERT INTO questionnaires
            (questionnaireID, questionnaireTitle)
            VALUES (@questionnaireID, @questionnaireTitle)
            ON DUPLICATE KEY UPDATE
              questionnaireTitle = @questionnaireTitle;`,
        [questionnaire.questionnaireID, questionnaire.questionnaireTitle]);

        for(const k in questionnaire.keywords) {
            const keywordText = questionnaire.keywords[k];

            let keywordID;
            try {
                keywordID = (await conn.query(`SELECT keywordID FROM keywords WHERE keywordText = ?;`, [keywordText]))[0].keywordID;
            } catch(err) {}

            if(!keywordID) {
                await conn.query(`
                    SET
                      @keywordText = ?;

                    INSERT INTO keywords
                    (keywordText)
                    VALUES (@keywordText);`,
                [keywordText]);

                keywordID = (await conn.query(`SELECT keywordID FROM keywords WHERE keywordText = ?;`, [keywordText]))[0].keywordID;
            }

            await conn.query(`
                SET
                  @questionnaireID = ?,
                  @keywordID = ?;

                INSERT IGNORE INTO questionnaire_keywords
                (questionnaireID, keywordID)
                VALUES (@questionnaireID, @keywordID);`,
            [questionnaire.questionnaireID, keywordID]);
        }

        for(const q in questionnaire.questions) {
            const question = questionnaire.questions[q];

            await conn.query(`
                SET
                  @qID = ?,
                  @questionnaireID = ?,
                  @qtext = ?,
                  @required = ?,
                  @type = ?;

                INSERT INTO questions
                (qID, questionnaireID, qtext, required, type)
                VALUES (@qID, @questionnaireID, @qtext, @required, @type)
                ON DUPLICATE KEY UPDATE
                  qtext = @qtext,
                  required = @required,
                  type = @type;`,
            [question.qID, questionnaire.questionnaireID, question.qtext, question.required, question.type]);

            for(const o in question.options) {
                const option = questionnaire.questions[q].options[o];

                await conn.query(`
                    SET FOREIGN_KEY_CHECKS = 0;

                    SET
                      @optID = ?,
                      @qID = ?,
                      @questionnaireID = ?,
                      @opttxt = ?,
                      @nextqID = ?;

                    INSERT INTO options
                    (optID, qID, questionnaireID, opttxt, nextqID)
                    VALUES (@optID, @qID, @questionnaireID, @opttxt, @nextqID)
                    ON DUPLICATE KEY UPDATE
                      opttxt = @opttxt,
                      nextqID = @nextqID;

                    SET FOREIGN_KEY_CHECKS = 1;`,
                [option.optID, question.qID, questionnaire.questionnaireID, option.opttxt, (option.nextqID != `-` ? option.nextqID : null)]);
            }
        }

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

/*
    Endpoint Implementation
    Resource URL: /admin/resetall
    Supported Methods: POST

    Resets the system database
*/
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

/*
    Endpoint Implementation
    Resource URL: /admin/resetq/:questionnaireID
    Supported Methods: POST

    Clears all answers given to a questionnaire
*/
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