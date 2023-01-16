const router = require(`./routes`);
const express = require(`express`);

const config = require(`./config`);

const errors = require(`./errors`);
const errorHandler = require(`./utils/errorHandler`);

const app = express();

app.use(express.json());
app.use(router);

app.all("*", (req, res, next) => {
    next(new errors.UsageError(`${req.method} ${req.originalUrl} is not supported`, 404));
});
app.use(errorHandler);

app.listen(config.http.port, config.http.host, () => {
    console.log(`Listening on http://${config.http.host}:${config.http.port}`);
});

module.exports = app;