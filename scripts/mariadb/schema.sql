DROP SCHEMA IF EXISTS `intelliq`;
CREATE SCHEMA IF NOT EXISTS `intelliq` DEFAULT CHARACTER SET utf8;
USE `intelliq`;

DROP TABLE IF EXISTS `intelliq`.`questionnaires`;

CREATE TABLE IF NOT EXISTS `intelliq`.`questionnaires` (
  `questionnaireID` BIGINT(19) UNSIGNED NOT NULL PRIMARY KEY,
  `questionnaireTitle` VARCHAR(45) NOT NULL)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`sessions`;

CREATE TABLE IF NOT EXISTS `intelliq`.`sessions` (
  `session` BIGINT(19) UNSIGNED NOT NULL PRIMARY KEY,
  `questionnaireID` BIGINT(19) UNSIGNED NOT NULL,
  INDEX `fk_sessions_questionnaires1_idx` (`questionnaireID` ASC),
  CONSTRAINT `fk_sessions_questionnaires1`
    FOREIGN KEY (`questionnaireID`)
    REFERENCES `intelliq`.`questionnaires` (`questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`keywords`;

CREATE TABLE IF NOT EXISTS `intelliq`.`keywords` (
  `keywordID` BIGINT(19) UNSIGNED NOT NULL PRIMARY KEY,
  `keywordText` VARCHAR(45) NOT NULL,
  UNIQUE INDEX `keywordText_UNIQUE` (`keywordText` ASC))
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`questions`;

CREATE TABLE IF NOT EXISTS `intelliq`.`questions` (
  `qID` BIGINT(19) UNSIGNED NOT NULL,
  `questionnaireID` BIGINT(19) UNSIGNED NOT NULL,
  `qtext` VARCHAR(255) NOT NULL,
  `required` TINYINT NOT NULL,
  `type` ENUM("question", "profile") NOT NULL,
  PRIMARY KEY(`qID`, `questionnaireID`),
  INDEX `fk_questions_questionnaires1_idx` (`questionnaireID` ASC),
  CONSTRAINT `fk_questions_questionnaires1`
    FOREIGN KEY (`questionnaireID`)
    REFERENCES `intelliq`.`questionnaires` (`questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`options`;

CREATE TABLE IF NOT EXISTS `intelliq`.`options` (
  `optID` BIGINT(19) UNSIGNED NOT NULL,
  `qID` BIGINT(19) UNSIGNED NOT NULL,
  `questionnaireID` BIGINT(19) UNSIGNED NOT NULL,
  `opttxt` VARCHAR(255) NOT NULL,
  `nextqID` BIGINT(19) UNSIGNED NOT NULL,
  PRIMARY KEY(`optID`, `qID`, `questionnaireID`),
  INDEX `fk_options_questions1_idx` (`qID` ASC, `questionnaireID` ASC),
  INDEX `fk_options_questions2_idx` (`nextqID` ASC),
  CONSTRAINT `fk_options_questions1`
    FOREIGN KEY (`qID` , `questionnaireID`)
    REFERENCES `intelliq`.`questions` (`qID` , `questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_options_questions2`
    FOREIGN KEY (`nextqID`)
    REFERENCES `intelliq`.`questions` (`qID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`answers`;

CREATE TABLE IF NOT EXISTS `intelliq`.`answers` (
  `session` BIGINT(19) UNSIGNED NOT NULL,
  `ans` BIGINT(19) UNSIGNED NOT NULL,
  `qID` BIGINT(19) UNSIGNED NOT NULL,
  `questionnaireID` BIGINT(19) UNSIGNED NOT NULL,
  PRIMARY KEY(`session`, `ans`, `qID`, `questionnaireID`),
  INDEX `fk_answers_sessions1_idx` (`session` ASC),
  INDEX `fk_answers_options1_idx` (`ans` ASC, `qID` ASC, `questionnaireID` ASC),
  CONSTRAINT `fk_answers_sessions1`
    FOREIGN KEY (`session`)
    REFERENCES `intelliq`.`sessions` (`session`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answers_options1`
    FOREIGN KEY (`ans` , `qID` , `questionnaireID`)
    REFERENCES `intelliq`.`options` (`optID` , `qID` , `questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `intelliq`.`questionnaires_has_keywords`;

CREATE TABLE IF NOT EXISTS `intelliq`.`questionnaires_has_keywords` (
  `questionnaireID` BIGINT(19) UNSIGNED NOT NULL,
  `keywordID` BIGINT(19) UNSIGNED NOT NULL,
  PRIMARY KEY(`questionnaireID`, `keywordID`),
  INDEX `fk_questionnaires_has_keywords_keywords1_idx` (`keywordID` ASC),
  INDEX `fk_questionnaires_has_keywords_questionnaires_idx` (`questionnaireID` ASC),
  CONSTRAINT `fk_questionnaires_has_keywords_questionnaires`
    FOREIGN KEY (`questionnaireID`)
    REFERENCES `intelliq`.`questionnaires` (`questionnaireID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questionnaires_has_keywords_keywords1`
    FOREIGN KEY (`keywordID`)
    REFERENCES `intelliq`.`keywords` (`keywordID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;