const { Parser } = require('json2csv');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    let resdata;
    /*
        Multer Error Handling
    */
    if(err.name == `MulterError`) {
        err.statusCode = 400;

        resdata = {
            status: "failed",
            reason: err.message
        };
    /*
        SQL Error Handling
    */
    } else if(err.name == `SqlError`) {
        err.statusCode = 200;

        resdata = {
            status: "failed",
            reason: err.text
        };
    /*
        Other Error Handling
    */
    } else {
        resdata = {
            status: err.status,
            message: err.message
        };
    }

    if(req.query.format == `csv`) {
        const parser = new Parser(Object.keys(resdata));

        res.type(`text/csv`);
        res.send(parser.parse(resdata));
    } else {
        res.status(err.statusCode).json(resdata);
    }
};