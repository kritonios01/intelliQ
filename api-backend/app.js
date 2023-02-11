const express = require(`express`);
const https = require(`https`);
const cors = require(`cors`);
const fs = require(`fs`);

const router = require(`./routes`);
const config = require(`./config`);

const errors = require(`./errors`);
const errorHandler = require(`./utils/errorHandler`);

const app = express();

app.use(cors(config.cors));
app.use(router);

app.use(express.json());

app.set('query parser', 'simple');

app.all(`*`, (req, res, next) => {
    next(new errors.UsageError(`Resource not found`, 404));
});
app.use(errorHandler);

/*
    Configuration Checks
*/
if(config.http.host == config.https.host && config.http.port == config.https.port) {
    console.error(`HTTP and HTTPS servers can't both be bound to the same host and port.`);
    process.exit(1);
}

/*
    HTTP Server
*/
if(config.http.enabled) {
    app.listen(config.http.port, config.http.host, () => {
        console.log(`Listening on http://${config.http.host}:${config.http.port}`);
    });

}

/*
    HTTPS/SSL Server
*/
if(config.https.enabled) {
    https.createServer(
        {
            key: fs.readFileSync(config.https.ssl.key),
            cert: fs.readFileSync(config.https.ssl.cert)
        },
    app).listen(config.https.port, config.https.host, () => {
        console.log(`Listening on https://${config.https.host}:${config.https.port}`);
    });
}

module.exports = app;