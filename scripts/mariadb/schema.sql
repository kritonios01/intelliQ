DROP SCHEMA IF EXISTS `intelliq`;
CREATE SCHEMA IF NOT EXISTS `intelliq` DEFAULT CHARACTER SET utf8;
USE `intelliq`;

DROP TABLE IF EXISTS `intelliq`.`questionnaires`;

CREATE TABLE IF NOT EXISTS `intelliq`.`questionnaires` (
  `questionnaireID` VARCHAR(8) NOT NULL PRIMARY KEY,
  `questionnaireTitle` VARCHAR(45) NOT NULL)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`sessions`;

CREATE TABLE IF NOT EXISTS `intelliq`.`sessions` (
  `session` VARCHAR(8) NOT NULL PRIMARY KEY,
  `questionnaireID` VARCHAR(8) NOT NULL,
  INDEX `fk_session_questionnaire_idx` (`questionnaireID` ASC),
  CONSTRAINT `fk_session_questionnaire`
    FOREIGN KEY (`questionnaireID`)
    REFERENCES `intelliq`.`questionnaires` (`questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`keywords`;

CREATE TABLE IF NOT EXISTS `intelliq`.`keywords` (
  `keywordID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `keywordText` VARCHAR(45) NOT NULL,
  UNIQUE INDEX `keywordtext_unq` (`keywordText` ASC))
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`questions`;

CREATE TABLE IF NOT EXISTS `intelliq`.`questions` (
  `qID` VARCHAR(8) NOT NULL,
  `questionnaireID` VARCHAR(8) NOT NULL,
  `qtext` VARCHAR(255) NOT NULL,
  `required` ENUM("TRUE", "FALSE") NOT NULL,
  `type` ENUM("question", "profile") NOT NULL,
  PRIMARY KEY(`qID`, `questionnaireID`),
  INDEX `fk_question_questionnaire_idx` (`questionnaireID` ASC),
  CONSTRAINT `fk_question_questionnaire`
    FOREIGN KEY (`questionnaireID`)
    REFERENCES `intelliq`.`questionnaires` (`questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`options`;

CREATE TABLE IF NOT EXISTS `intelliq`.`options` (
  `optID` VARCHAR(8) NOT NULL,
  `qID` VARCHAR(8) NOT NULL,
  `questionnaireID` VARCHAR(8) NOT NULL,
  `opttxt` VARCHAR(255) NOT NULL,
  `nextqID` VARCHAR(8),
  PRIMARY KEY(`optID`, `qID`, `questionnaireID`),
  INDEX `fk_option_question_idx` (`qID` ASC, `questionnaireID` ASC),
  INDEX `fk_option_nextqid_idx` (`nextqID` ASC),
  CONSTRAINT `fk_option_question`
    FOREIGN KEY (`qID` , `questionnaireID`)
    REFERENCES `intelliq`.`questions` (`qID` , `questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_option_nextqid`
    FOREIGN KEY (`nextqID`)
    REFERENCES `intelliq`.`questions` (`qID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`answers`;

CREATE TABLE IF NOT EXISTS `intelliq`.`answers` (
  `session` VARCHAR(8) NOT NULL,
  `ans` VARCHAR(8) NOT NULL,
  `qID` VARCHAR(8) NOT NULL,
  `questionnaireID` VARCHAR(8) NOT NULL,
  PRIMARY KEY(`session`, `qID`, `questionnaireID`),
  INDEX `fk_answer_session_idx` (`session` ASC),
  INDEX `fk_answer_option_idx` (`ans` ASC, `qID` ASC, `questionnaireID` ASC),
  CONSTRAINT `fk_answer_session`
    FOREIGN KEY (`session`)
    REFERENCES `intelliq`.`sessions` (`session`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_option`
    FOREIGN KEY (`ans` , `qID` , `questionnaireID`)
    REFERENCES `intelliq`.`options` (`optID` , `qID` , `questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`questionnaire_keywords`;

CREATE TABLE IF NOT EXISTS `intelliq`.`questionnaire_keywords` (
  `questionnaireID` VARCHAR(8) NOT NULL,
  `keywordID` INT UNSIGNED NOT NULL,
  PRIMARY KEY(`questionnaireID`, `keywordID`),
  INDEX `fk_questionnaire_keyword_keyword_id_idx` (`keywordID` ASC),
  INDEX `fk_questionnaire_keyword_questionnaire_id_idx` (`questionnaireID` ASC),
  CONSTRAINT `fk_questionnaire_keyword_questionnaire_id`
    FOREIGN KEY (`questionnaireID`)
    REFERENCES `intelliq`.`questionnaires` (`questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questionnaire_keyword_keyword_id`
    FOREIGN KEY (`keywordID`)
    REFERENCES `intelliq`.`keywords` (`keywordID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;