/*
            intelliQ
    API (Backend) Application
        Configuration File
*/

const config = {
    // HTTP server configuration
    http: {
        enabled: true,
        host: "127.0.0.1",
        port: 9102

    },

    // HTTPS server configuration
    https: {
        enabled: false,
        host: "127.0.0.1",
        port: 9103,
        ssl: {
            key: "",
            cert: ""
        }
    },

    // Cross-Origin Resource Sharing configuration
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    cors: {
        origin: /^(http:\/\/|https:\/\/)?(intelliq.site|localhost)\/?$/,
        optionsSuccessStatus: 200
    },

    // Documentation configuration
    // Available at /docs when enabled
    docs: {
        enabled: true
    },

    // MariaDB configuration
    // Leave password field empty for users witout password
    mariadb: {
        host: "127.0.0.1",
        port: 3306,
        user: "intelliq",
        password: "",
        database: "intelliq"
    }
};

module.exports = config;