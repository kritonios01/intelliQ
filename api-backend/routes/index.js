const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router
    .route("/intelliq_api/admin/healthcheck")
    .get(controllers.healthcheck);

module.exports = router;