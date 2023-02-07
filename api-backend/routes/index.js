const multer = require(`multer`);
const express = require(`express`);
const errors = require(`../errors`);
const controllers = require(`../controllers`);

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const router = express.Router();

/*
    Errors
*/
const methodNotAllowed = (req, res, next) => next(new errors.UsageError(`Method not supported`, 405));

/*
    Administrative Endpoint Routes
*/

router
    .route("/intelliq_api/admin/healthcheck")
    .get(controllers.admin.healthcheck)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/admin/questionnaire_upd")
    .post(upload.single(`file`), controllers.admin.questionnaire_upd)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/admin/resetall")
    .post(controllers.admin.resetall)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/admin/resetq/:questionnaireID")
    .post(controllers.admin.resetq)
    .all(methodNotAllowed);

/*
    User Endpoint Routes
*/

router
    .route("/intelliq_api/questionnaire/:questionnaireID")
    .get(controllers.user.questionnaire)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/questionnaires")
    .get(controllers.user.questionnaires)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/question/:questionnaireID/:questionID")
    .get(controllers.user.question)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID")
    .post(controllers.user.doanswer)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/getsessionanswers/:questionnaireID/:session")
    .get(controllers.user.getsessionanswers)
    .all(methodNotAllowed);

router
    .route("/intelliq_api/getquestionanswers/:questionnaireID/:questionID")
    .get(controllers.user.getquestionanswers)
    .all(methodNotAllowed);

module.exports = router;