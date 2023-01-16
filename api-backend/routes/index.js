const multer = require("multer");
const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

/*
    Administrative Endpoints Routes
*/

router
    .route("/intelliq_api/admin/healthcheck")
    .get(controllers.admin.healthcheck);

router
    .route("/intelliq_api/admin/questionnaire_upd")
    .post(multer().none(), controllers.admin.questionnaire_upd);

router
    .route("/intelliq_api/admin/resetall")
    .post(controllers.admin.resetall);

router
    .route("/intelliq_api/admin/resetq/:questionnaireID")
    .post(controllers.admin.resetq);

/*
    User Endpoints Routes
*/

router
    .route("/intelliq_api/questionnaire/:questionnaireID")
    .get(controllers.user.questionnaire);

router
    .route("/intelliq_api/question/:questionnaireID/:questionID")
    .get(controllers.user.question);

router
    .route("/intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID")
    .post(controllers.user.doanswer);

router
    .route("/intelliq_api/getsessionanswers/:questionnaireID/:session")
    .get(controllers.user.getsessionanswers);

router
    .route("/intelliq_api/getquestionanswers/:questionnaireID/:questionID")
    .get(controllers.user.getquestionanswers);

module.exports = router;