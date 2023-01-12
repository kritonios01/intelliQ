const express = require('express');
const router = require('./routes');

const config = require('./config');

const APIError = require('./utils/APIError');
const errorHandler = require('./utils/errorHandler');

const app = express();

app.use(express.json());
app.use(router);

app.all("*", (req, res, next) => {
    next(new APIError(`${req.originalUrl} is not a vaild endpoint`, 404));
});
app.use(errorHandler);

app.listen(config.http.port, config.http.host, () => {
    console.log(`Listening on http://${config.http.host}:${config.http.port}`);
});

module.exports = app;