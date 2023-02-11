/*
            intelliQ
    API (Backend) Application
        Configuration File
*/

const config = {
    http: {
        enabled: false,
        host: "127.0.0.1",
        port: 9102

    },

    https: {
        enabled: true,
        host: "0.0.0.0",
        port: 9103,
        ssl: {
            key: "ssl/key.pem",
            cert: "ssl/cert.pem"
        }
    },

    cors: {
        origin: true,
        optionsSuccessStatus: 200
    },

    mariadb: {
        host: "intelliq-database",
        port: 3306,
        user: "intelliq",
		password: "intelliq",
        database: "intelliq"
    }
};

module.exports = config;