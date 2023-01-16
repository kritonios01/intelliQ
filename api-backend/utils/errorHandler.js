module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 200;
    err.status = err.status || "error";

    if(err.name == `SqlError`) {
        res.status(err.statusCode).json({
            status: "failed",
            reason: err.text
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
};