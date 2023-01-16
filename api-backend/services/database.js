const mariadb = require(`mariadb`);
const config = require(`../config`);

config.mariadb.multipleStatements = true;

const pool = mariadb.createPool(config.mariadb);

module.exports = pool;