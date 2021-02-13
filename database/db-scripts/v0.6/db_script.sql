CREATE TABLE IF NOT EXISTS `kyb_doc_comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(45) DEFAULT NULL,
  `kyb_business_docs_id` int(11) NOT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `kyb_business_docs_id` (`kyb_business_docs_id`),
  CONSTRAINT `kyb_doc_comments_ibfk_1` FOREIGN KEY (`kyb_business_docs_id`) REFERENCES `kyb_business_docs` (`kyb_business_docs_id`)
) ;

CREATE TABLE IF NOT EXISTS `kyb_doc_status` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(45) DEFAULT NULL,
  `status` enum('0','1') DEFAULT '1',
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`status_id`)
);

CREATE TABLE IF NOT EXISTS `kyb_doc_type` (
  `doc_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_type_name` varchar(45) DEFAULT NULL,
  `status` enum('0','1') DEFAULT '1',
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`doc_type_id`)
);


CREATE TABLE IF NOT EXISTS `kyb_file_type` (
  `file_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_type_name` varchar(45) DEFAULT NULL,
  `status` enum('0','1') DEFAULT '1',
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_type_id`)
) ;

INSERT INTO `kyb_doc_status`(`status_id`,`status_name`) VALUES
	
 (1,'Pending'),
 (2,'Declined'),
 (3,'Approved'),
 (4,'Submitted') ON DUPLICATE KEY UPDATE `status_name`=VALUES(`status_name`);
 
INSERT INTO `kyb_doc_type`(`doc_type_id`,`doc_type_name`) VALUES
 (1,'Proof of registered address'),
 (2,'Proof of operating address'),
 (3,'Authority to open account'),
 (4,'Proof of shareholder structure') ON DUPLICATE KEY UPDATE `doc_type_name`=VALUES(`doc_type_name`);
 
INSERT INTO `kyb_file_type`(`file_type_id`,`file_type_name`) VALUES
 (1,'PDF'),
 (2,'JPG'),
 (3,'JPEG'),
 (4,'PNG') ON DUPLICATE KEY UPDATE `file_type_name`=VALUES(`file_type_name`);


ALTER TABLE `kyb_business_docs` 
CHANGE COLUMN IF EXISTS`kyb_doc_type` `kyb_doc_type` INT(11) NULL DEFAULT NULL ,
CHANGE COLUMN IF EXISTS `kyb_doc_file_type` `kyb_doc_file_type` INT(11) NULL DEFAULT NULL ,
ADD COLUMN IF NOT EXISTS `doc_name` VARCHAR(150) NULL AFTER `updated_on`,
ADD COLUMN IF NOT EXISTS `doc_status` INT(11) NULL AFTER `doc_name`;


ALTER TABLE `kyb_business_docs` 
ADD INDEX IF NOT EXISTS `fk_kyb_business_docs_type_table_id_idx` (`kyb_doc_type` ASC),
ADD INDEX IF NOT EXISTS `fk_kyb_business_docs_file_type_table_id_idx` (`kyb_doc_file_type` ASC),
ADD INDEX IF NOT EXISTS `fk_kyb_business_docs_status_table_id_idx` (`doc_status` ASC);

SET FOREIGN_KEY_CHECKS=0; 
ALTER TABLE `kyb_business_docs` 
ADD CONSTRAINT `fk_kyb_business_docs_type_table_id`
  FOREIGN KEY IF NOT EXISTS (`kyb_doc_type`)
  REFERENCES `kyb_doc_type` (`doc_type_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_kyb_business_docs_file_type_table_id`
  FOREIGN KEY IF NOT EXISTS (`kyb_doc_file_type`)
  REFERENCES `kyb_file_type` (`file_type_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_kyb_business_docs_status_table_id`
  FOREIGN KEY IF NOT EXISTS (`doc_status`)
  REFERENCES `kyb_doc_status` (`status_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  SET FOREIGN_KEY_CHECKS=1;

