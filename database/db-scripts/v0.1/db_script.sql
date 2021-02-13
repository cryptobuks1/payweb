/*This file contains the basic DataBase for PayVoo application*/

/*
1. Version = 0.1.
2. Mariadb Version = 10.3.20.
3. Number of table created = 51.
*/



CREATE DATABASE IF NOT EXISTS `payvoo2`;
/*Using database*/
USE `payvoo2`;

/*applicant table created to generate unique id known as applicant_id
and to store the account_type. During the user registration, first the
data will be inserted into this table, Which will create an applicant_id send back in response.*/
CREATE TABLE IF NOT EXISTS `applicant` (
  `applicant_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type` varchar(100) NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*contact table is meant to store all the contact detail of an  user like email, phone number,
 name etc. Here contact_id will auto generate which will act as primary key for this table. Here
 email and phone will be unique. */
CREATE TABLE IF NOT EXISTS `contact` (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `gender` varchar(100) DEFAULT 'MALE',
  `dob` date DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `mobile` varchar(50) NOT NULL,
  `phone` varchar(25) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  KEY `fk_contact_table_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_contact_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This table to store country related data such as calling_code,country_id which are usefull 
at various time whine using this application.*/
CREATE TABLE IF NOT EXISTS `country` (
  `country_id` int(11) NOT NULL AUTO_INCREMENT,
  `country_name` varchar(100) NOT NULL,
  `calling_code` int(11) DEFAULT NULL,
  `country_code` char(50) DEFAULT NULL,
  `currency` varchar(15) DEFAULT NULL,
  `currency_symbol` varchar(25) CHARACTER SET utf8 DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `country_flag_img_path` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Demo data for country*/
INSERT INTO `country` (`country_id`, `country_name`, `calling_code`, `country_code`, `currency`, `currency_symbol`, `status`, `country_flag_img_path`,  `created_on`, `updated_on`) VALUES
	(1, 'BULGARIA', 359, 'BG', 'BGN', 'Лв', 1, '/images/country_flag_img_path/bulgaria_640.png', NULL, '2019-08-29 15:08:31'),
	(2, 'EUROPE', 0, 'EU', 'EUR', '£', 1, '/images/country_flag_img_path/euroFlag@3x.png', NULL, '2019-12-13 12:07:05'),
	(3, 'AUSTRIA ', 43, 'AT', 'EUR', '£', 0, '', NULL, '2019-08-29 15:24:11'),
	(4, 'BELGIUM ', 32, 'BG', 'EUR', '£', 0, '', NULL, '2019-08-29 15:24:06'),
	(5, 'INDIA', 91, 'IN', 'INR', '₹', 0, '/images/country_flag_img_path/india_640.png', NULL, '2019-12-12 15:10:24'),
	(6, 'CANARY ISLANDS ', 34, 'AT', 'EUR', '£', 0, '', NULL, '2019-08-29 15:24:00'),
	(7, 'CROATIA ', 385, 'HR', 'HRK', 'kn', 1, '/images/country_flag_img_path/croatia_640.png', NULL, '2019-08-29 15:21:27'),
	(8, 'CYPRUS ', 357, 'CY', 'EUR', '£', 1, '/images/country_flag_img_path/cyprus_640.png', NULL, '2019-08-29 15:22:08'),
	(9, 'CZECH REPUBLIC', 420, 'CZ', 'CZK', 'Kč', 1, '/images/country_flag_img_path/czech_republic_640.png', NULL, '2019-08-29 15:22:25'),
	(10, 'ESTONIA ', 372, 'EE', 'EUR', '£', 1, '/images/country_flag_img_path/estonia_640.png', NULL, '2019-08-29 15:22:48'),
	(11, 'AZORES ', 351, 'PT', 'EUR', '£', 0, '', NULL, '2019-08-29 15:23:56'),
	(12, 'DENMARK', 45, 'DK', 'DKK', 'Kr', 1, '/images/country_flag_img_path/denmark_640.png', NULL, '2019-08-29 15:23:08'),
	(13, 'FINLAND', 358, 'FI', 'EUR', '£', 1, '/images/country_flag_img_path/finland_640.png', NULL, '2019-08-29 15:23:24'),
	(14, 'FRANCE', 33, 'FR', 'EUR', '£', 1, '/images/country_flag_img_path/france_640.png', NULL, '2019-08-29 15:23:42'),
	(15, 'FRENCH GUIANA', 594, 'GF', 'EUR', '£', 0, '', NULL, '2019-08-29 15:23:53'),
	(16, 'GIBRALTER', 350, 'GI', 'EUR', '£', 0, '', NULL, '2019-08-29 15:23:49'),
	(17, 'GREECE', 30, 'GR', 'EUR', '£', 1, '/images/country_flag_img_path/greece_640.png', NULL, '2019-08-29 15:20:48'),
	(18, 'GUADELOUPE', 590, 'GP', 'EUR', '£', 0, '', NULL, '2019-08-29 15:35:00'),
	(19, 'SWEDEN', 46, 'SE', 'SEK', 'kr', 1, '/images/country_flag_img_path/sweden_640.png', NULL, '2019-08-29 15:19:37'),
	(20, 'UK', 44, 'UK', 'GBP', '£', 1, '/images/country_flag_img_path/united_kingdom_640.png', NULL, '2019-08-29 15:09:17'),
	(21, 'HUNGARY', 36, 'HU', 'HUF', 'Ft', 1, '/images/country_flag_img_path/hungary_640.png', NULL, '2019-08-29 15:09:43'),
	(22, 'IRELAND', 353, 'IE', 'EUR', '£', 1, '/images/country_flag_img_path/ireland_640.png', NULL, '2019-08-29 15:10:28'),
	(23, 'ITALY', 39, 'IT', 'EUR', '£', 1, '/images/country_flag_img_path/italy_640.png', NULL, '2019-08-29 15:10:46'),
	(24, 'LATVIA', 371, 'LV', 'EUR', '£', 1, '/images/country_flag_img_path/latvia_640.png', NULL, '2019-08-29 15:11:02'),
	(25, 'LITHUANIA', 370, 'LT', 'EUR', '£', 1, '/images/country_flag_img_path/lithuania_640.png', NULL, '2019-08-29 15:11:36'),
	(26, 'LUXEMBOURG', 352, 'LU', 'EUR', '£', 1, '/images/country_flag_img_path/luxembourg_640.png', NULL, '2019-08-29 15:12:06'),
	(27, 'MALTA', 356, 'MT', 'EUR', '£', 1, '/images/country_flag_img_path/malta_640.png', NULL, '2019-08-29 15:12:22'),
	(28, 'NETHERLANDS', 31, 'NL', 'EUR', '£', 1, '/images/country_flag_img_path/netherlands_640.png', NULL, '2019-08-29 15:12:58'),
	(29, 'POLAND', 48, 'PL', 'PLN', 'zł', 1, '/images/country_flag_img_path/poland_640.png', NULL, '2019-08-29 15:13:14'),
	(30, 'PORTUGAL', 351, 'PT', 'EUR', '£', 1, '/images/country_flag_img_path/portugal_640.png', NULL, '2019-08-29 15:13:33'),
	(31, 'ROMANIA', 40, 'RO', 'RON', 'leu', 1, '/images/country_flag_img_path/romania_640.png', NULL, '2019-08-29 15:13:50'),
	(32, 'SLOVAKIA', 421, 'SK', 'EUR', '£', 1, '/images/country_flag_img_path/slovakia_640.png', NULL, '2019-08-29 15:18:46'),
	(33, 'SLOVENIA', 386, 'SI', 'EUR', '£', 1, '/images/country_flag_img_path/slovenia_640.png', NULL, '2019-08-29 15:19:01'),
	(34, 'SPAIN', 34, 'ES', 'EUR', '£', 1, '/images/country_flag_img_path/spain_640.png', NULL,'2019-08-29 15:19:16'),
	(35, 'USA', 1, 'US', 'USD', '$', 1, '/images/country_flag_img_path/united_states_of_america_640.png', NULL, '2019-12-13 12:23:57'),
	(36, 'GERMANY', 49, 'DE', 'EUR', '£', 1, '/images/country_flag_img_path/germany_640.png', NULL, '2019-08-29 15:21:07');

/*This table is to store type of address of an individual user or a company. Input value will be like 
'PERSONAL','BUSINESS' or 'OPERATIG'*/
CREATE TABLE IF NOT EXISTS `address_type` (
  `address_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `address_type` varchar(50) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`address_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*inserting Demo data into address_type table*/
INSERT INTO `address_type` (`address_type_id`, `address_type`) VALUES
	(1, 'PERSONAL_ADDRESS'),
	(2, 'BUSINESS_ADDRESS'),
	(3, 'OPERATING_ADDRESS'),
	(4, 'SHIPPING_ADDRESS'),
	(5, 'BILLING_ADDRESS');

/*This table is to store address detail of an user as well as company with respective address_type.*/
CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `country_id` int(50) DEFAULT NULL,
  `address_type_id` int(11) DEFAULT 1,
  `address_line1` varchar(100) DEFAULT NULL,
  `address_line2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `town` varchar(100) DEFAULT NULL,
  `postal_code` varchar(50) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `fk_address_table_applicant_id` (`applicant_id`),
  KEY `fk_address_table_contact_id` (`contact_id`),
  KEY `fk_address_table_country_id` (`country_id`),
  KEY `fk_address_table_address_type_id` (`address_type_id`),
  CONSTRAINT `fk_address_table_address_type_id` FOREIGN KEY (`address_type_id`) REFERENCES `address_type` (`address_type_id`),
  CONSTRAINT `fk_address_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
  CONSTRAINT `fk_address_table_contact_id` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`contact_id`),
  CONSTRAINT `fk_address_table_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*This table is to store different roles defiened in this application.*/
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Insert demo data into role table*/
INSERT INTO `role` (`role_id`, `role_name`) VALUES
	(1, 'ADMIN'),
	(2, 'ACCOUNTANT'),
	(3, 'VIEWER');


/*This table will store different types of document for different countres.*/
CREATE TABLE IF NOT EXISTS `kyc_document_lov` (
  `kyc_doc_id` int(11) NOT NULL AUTO_INCREMENT,
  `country_id` int(11) DEFAULT NULL,
  `document_name` varchar(25) NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`kyc_doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This table is to store kycrelated data of an user.*/
CREATE TABLE IF NOT EXISTS `kyc` (
  `kyc_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `kyc_doc_id` int(11) DEFAULT NULL,
  `kyc_transaction_id` varchar(50) DEFAULT NULL,
  `kyc_vendor_id` varchar(50) DEFAULT NULL,
  `kyc_status` varchar(250) DEFAULT 'NOT_INITIATED',
  `kyc_doc_front` blob DEFAULT NULL,
  `kyc_doc_back` blob DEFAULT NULL,
  `photograph` blob DEFAULT NULL,
  `kyc_initiated_on` datetime DEFAULT NULL,
  `kyc_updated_on` timestamp NOT NULL NULL,
  `completed_on` datetime DEFAULT NULL,
  PRIMARY KEY (`kyc_id`),
  KEY `fk_kyc_table_applicant_id` (`applicant_id`),
  KEY `fk_kyc_table_kyc_doc_id` (`kyc_doc_id`),
  CONSTRAINT `fk_kyc_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
  CONSTRAINT `fk_kyc_table_kyc_doc_id` FOREIGN KEY (`kyc_doc_id`) REFERENCES `kyc_document_lov` (`kyc_doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*This table is to store type of business. i.e solo or partner.*/
CREATE TABLE IF NOT EXISTS `business_type` (
  `business_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_type_name` varchar(50) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*Demo data for business_type*/
INSERT INTO `business_type` (`business_type_id`, `business_type_name`) VALUES
	(1, 'SOLE  PROPRIETORSHIP'),
	(2, 'PARTNERSHIP'),
	(3, 'CORPORATION'),
	(4, 'LIMITED  LIABILITY  COMPANY'),
	(5, 'COOPERATIVE'),
  (6,'SANDBOX');
  
/*This is the main table which will  store all the business related data such as Name, trading name,
 incorporation date, country and details of directors also.*/

 CREATE TABLE IF NOT EXISTS `business_details` (
  `business_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `country_of_incorporation` int(11) DEFAULT NULL,
  `business_type` int(11) DEFAULT NULL,
  `business_legal_name` varchar(50) DEFAULT NULL,
  `trading_name` varchar(50) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `incorporation_date` date DEFAULT NULL,
  `business_directors` longtext DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`business_id`),
  KEY `fk_business_details_table_applicant_id` (`applicant_id`),
  KEY `fk_business_details_table_country_of_incorporation` (`country_of_incorporation`),
  KEY `fk_business_details_table_business_type` (`business_type`),
  CONSTRAINT `fk_business_details_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
  CONSTRAINT `fk_business_details_table_business_type` FOREIGN KEY (`business_type`) REFERENCES `business_type` (`business_type_id`),
  CONSTRAINT `fk_business_details_table_country_of_incorporations_country` FOREIGN KEY (`country_of_incorporation`) REFERENCES `country` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This is meant to store the staus of various KYB steps*/
CREATE TABLE IF NOT EXISTS `kyb_business` (
  `kyb_business_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `kyb_status` varchar(15) DEFAULT NULL,
  `kyb_initiated_on` datetime DEFAULT NULL,
  `kyb_updated_on` datetime DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `kyb_completed_on` datetime DEFAULT NULL,
  `isRestricted` tinyint(4) DEFAULT 0,
  `type_of_business` enum('0','1','2') NOT NULL DEFAULT '0',
  `business_address` enum('0','1','2') NOT NULL DEFAULT '0',
  `personal_profile` enum('0','1','2') NOT NULL DEFAULT '0',
  `business_owner_details` enum('0','1','2') NOT NULL DEFAULT '0',
  PRIMARY KEY (`kyb_business_id`),
  KEY `kyb_business_table_business_id` (`business_id`),
  CONSTRAINT `kyb_business_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This table to store refference of business related docs*/
CREATE TABLE IF NOT EXISTS `kyb_business_docs` (
  `kyb_business_docs_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `kyb_doc_type` varchar(250) DEFAULT NULL,
  `kyb_doc_file_type` varchar(250) DEFAULT NULL,
  `kyb_doc_base64` longtext DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`kyb_business_docs_id`),
  KEY `kyb_business_docs_table_business_id` (`business_id`),
  CONSTRAINT `kyb_business_docs_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This table will store kyb related data of a business owner*/
CREATE TABLE IF NOT EXISTS `kyb_business_owner` (
  `kyb_bo_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `percentage` varchar(50) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`kyb_bo_id`),
  KEY `kyb_business_owner_table_business_id` (`business_id`),
  CONSTRAINT `kyb_business_owner_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*This table is meant to store tha data of each country detail with whome a company will do transaction*/

/*Global country list table*/
CREATE TABLE IF NOT EXISTS `global_country_list` (
  `country_id` int(11) NOT NULL AUTO_INCREMENT,
  `country_name` varchar(100) DEFAULT NULL,
  `isRestricted` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `business_transaction_countries` (
	`business_transaction_countries_id` INT(11) NOT NULL AUTO_INCREMENT,
	`business_id` INT(11) DEFAULT NULL,
	`country_id` INT(11) DEFAULT NULL,
	`business_description` VARCHAR(150) DEFAULT NULL,
	`transaction_type` VARCHAR(25) DEFAULT NULL,
	`created_on` DATETIME DEFAULT NULL,
	`updated_on` DATETIME DEFAULT NULL,
	PRIMARY KEY (`business_transaction_countries_id`),
	KEY `business_transaction_countries_table_business_id` (`business_id`),
	KEY `business_transaction_countries_table_country_id` (`country_id`),
	CONSTRAINT `business_transaction_countries_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`),
	CONSTRAINT `business_transaction_countries_table_country_id` FOREIGN KEY (`country_id`) REFERENCES `global_country_list` (`country_id`)
)ENGINE=InnoDB;


/*This table will store the transaction detail of each business*/
CREATE TABLE IF NOT EXISTS `business_transactions` (
  `business_trans_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `monthly_transfer_amount` varchar(50) DEFAULT NULL,
  `no_payments_per_month` varchar(50) DEFAULT NULL,
  `max_value_of_payments` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_trans_id`),
  KEY `fk_business_transactiona_table_business_id` (`business_id`),
  CONSTRAINT `fk_business_transactiona_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/**/
CREATE TABLE IF NOT EXISTS `business_service_lov` (
  `business_service_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_service_name` varchar(50) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This table is to store the data ralated business sector like Agricultur,Minning and Transport*/
CREATE TABLE IF NOT EXISTS `business_sector_lov` (
  `business_sector_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_sector_name` varchar(250) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `business_sector_lov` (`business_sector_id`, `business_sector_name`) VALUES
	(1, 'Agriculture, Forestry and Fishing'),
	(2, 'Mining'),
	(3, 'Construction'),
	(4, 'Manufacturing'),
	(5, 'Transportation, Communications, Electric, Gas and Sanitary services'),
	(6, 'Wholesale Trade'),
	(7, 'Retail Trade'),
	(8, 'Finance, Insurance and Real Estate'),
	(9, 'Services'),
	(10, 'Public Administration');

/*This table will store the data of selected business sector and social media etc.*/
CREATE TABLE IF NOT EXISTS `business_sector_details` (
  `business_sector_details_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `business_sector` int(11) DEFAULT NULL,
  `range_of_service` varchar(250) DEFAULT NULL,
  `website` varchar(150) DEFAULT NULL,
  `restricted_business` tinyint(1) DEFAULT NULL,
  `selected_industries` varchar(150) DEFAULT NULL,
  `restricted_industries` varchar(150) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_sector_details_id`),
  KEY `fk_business_sector_details_table_business_id` (`business_id`),
  KEY `fk_business_sector_details_table_business_sector` (`business_sector`),
  CONSTRAINT `fk_business_sector_details_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`),
  CONSTRAINT `fk_business_sector_details_table_business_sector` FOREIGN KEY (`business_sector`) REFERENCES `business_sector_lov` (`business_sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*This table is to store all the owner of a business */
CREATE TABLE IF NOT EXISTS `business_owner` (
  `business_owner_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `business_owner_type` varchar(25) DEFAULT NULL,
  `percentage` varchar(25) DEFAULT NULL,
  `email_verified` tinyint(4) DEFAULT NULL,
  `mobile_verfied` tinyint(4) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_owner_id`),
  KEY `fk_business_owner_table_business_id` (`business_id`),
  KEY `fk_business_owner_table_conatct_id` (`contact_id`),
  CONSTRAINT `fk_business_owner_table_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`),
  CONSTRAINT `fk_business_owner_table_conatct_id` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*To store all the available industry with wheather they are in restricted category or not.*/
CREATE TABLE IF NOT EXISTS `business_industry_lov` (
  `business_industry_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_industry_name` varchar(250) DEFAULT NULL,
  `restricted` tinyint(4) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`business_industry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for business_industry_lov table*/
INSERT INTO `business_industry_lov` (`business_industry_id`, `business_industry_name`,`restricted`) VALUES
	(1, 'Armaments, nuclear, weapons or defense manufacturers',1),
	(2, 'Adult entertainment or the sale or advertising of sexual services',1),
	(3, 'Art dealers, auction houses or pawnbroker',0),
	(4, 'Industrial chemical or legal high companies',0),
	(5, 'Client money processing firms',0),
	(6, 'Cryptocurrency processing firms',1),
	(7, 'FX speculators',0),
	(8, 'Gambling firms or video game arcades',1),
	(9, 'Nonprofit, political and religious organisations',0),
	(10, 'Precious metals and stones firms',0),
	(11, 'Sale of used cars or heavy industry vehicles',0);

  /*Store all the details of a company which are retrived from KOMPANY API.*/
 CREATE TABLE IF NOT EXISTS `kyb_company_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kyb_business_id` int(11) DEFAULT NULL,
  `company_details` longtext DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `update_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_kyb_company_details_table_kyb_business_id` (`kyb_business_id`),
  CONSTRAINT `fk_kyb_company_details_table_kyb_business_id` FOREIGN KEY (`kyb_business_id`) REFERENCES `business_details` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*Table to store card details of an user*/

CREATE TABLE `payment_cards` (
  `payment_cards_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL DEFAULT 0,
  `card_type` varchar(50) NOT NULL DEFAULT '',
  `name_on_card` varchar(64) NOT NULL DEFAULT '',
  `card_number` varchar(8) DEFAULT NULL,
  `card_cvv` varchar(16) NOT NULL DEFAULT '',
  `card_month` text DEFAULT NULL,
  `card_year` text DEFAULT NULL,
  `encrypted_card` text NOT NULL,
  `encrypted_key` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `default_card` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`payment_cards_id`),
  KEY `fk__payment_cards_applicant_id` (`applicant_id`),
  CONSTRAINT `fk__payment_cards_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table to store payment detail of individual user*/

CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `paymentsid` int(11) NOT NULL,
  `paymentType` enum('DB','CR') NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `payment_Brand` varchar(15) DEFAULT NULL,
  `payment_Mode` varchar(15) DEFAULT NULL,
  `first_Name` varchar(50) DEFAULT NULL,
  `last_Name` varchar(50) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT 0.00,
  `currency` varchar(11) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `card` longtext DEFAULT NULL,
  `customer` longtext DEFAULT NULL,
  `transaction_details` longtext DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `merchant_Transaction_Id` varchar(100) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `trans_Status` varchar(100) DEFAULT NULL,
  `tmpl_amount` decimal(15,2) DEFAULT NULL,
  `tmpl_currency` varchar(100) DEFAULT NULL,
  `eci` varchar(100) DEFAULT NULL,
  `checksum` varchar(100) DEFAULT NULL,
  `order_Description` varchar(100) DEFAULT NULL,
  `company_Name` varchar(100) DEFAULT NULL,
  `merchant_contact` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payments_table_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_payments_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*To stote accounts data*/

CREATE TABLE IF NOT EXISTS `accounts` (
  `account_no` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL DEFAULT 0,
  `role_id` int(11) DEFAULT NULL,
  `currency` varchar(15) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `balance` decimal(15,2) DEFAULT 0.00,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`account_no`),
  KEY `fk_accountstable_applicant_id` (`applicant_id`),
  KEY `fk_accounts_table_role_id` (`role_id`),
  CONSTRAINT `fk_accounts_table_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/* Table to store the transactions*/
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `transaction_number` varchar(50) DEFAULT NULL,
  `transaction_type` enum('DB','CR') DEFAULT NULL,
  `from_account` int(11) NOT NULL DEFAULT 0,
  `to_account` int(11) NOT NULL DEFAULT 0,
  `currency_type` varchar(5) NOT NULL DEFAULT '',
  `counterparty` varchar(100) DEFAULT NULL,
  `account_type` varchar(15) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT 0.00,
  `created_on` datetime DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `fk_transaction_table_applicant_id` (`applicant_id`),
  KEY `fk_transaction_table_from_account` (`from_account`),
  KEY `fk_transaction_table_to_account` (`to_account`),
  KEY `fk_transaction_table_currency_type` (`currency_type`),
  CONSTRAINT `fk_transaction_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
  CONSTRAINT `fk_transaction_table_from_account` FOREIGN KEY (`from_account`) REFERENCES `accounts` (`account_no`),
  CONSTRAINT `fk_transaction_table_to_account` FOREIGN KEY (`to_account`) REFERENCES `accounts` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*table to store Rates of currency*/
CREATE TABLE IF NOT EXISTS `check_rates` (
  `check_rates_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `from_currency` varchar(25) DEFAULT NULL,
  `to_currency` varchar(25) DEFAULT NULL,
  `isConvert` tinyint(4) DEFAULT 0,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`check_rates_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* Table for sandbox */
CREATE TABLE IF NOT EXISTS `sandbox` (
  `sandbox_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `memberId` varchar(100) DEFAULT NULL,
  `api_key` varchar(100) DEFAULT NULL,
  `url` varchar(150) DEFAULT NULL,
  `api_doc_url` varchar(150) DEFAULT NULL,
  `redirect_url` varchar(150) DEFAULT NULL,
  `created_on` datetime DEFAULT current_timestamp(),
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`sandbox_id`),
  KEY `fk_payvoo_sandbox_table_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_payvoo_sandbox_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `currency_exchange` (
  `auto_exchange_id` int(5) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(5) DEFAULT NULL,
  `account_no` int(5) DEFAULT NULL,
  `from_currency` varchar(5) DEFAULT NULL,
  `to_currency` varchar(5) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `target_amount` decimal(15,2) DEFAULT NULL,
  `exchange_status` tinyint(4) NOT NULL DEFAULT 1,
  `status` int(2) NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`auto_exchange_id`),
  KEY `fk_check_rates_table_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_check_rates_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*Table for price alert*/

CREATE TABLE IF NOT EXISTS `price_alert` (
  `price_alert_id` int(5) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(5) DEFAULT NULL,
  `from_currency` varchar(5) DEFAULT NULL,
  `to_currency` varchar(5) DEFAULT NULL,
  `target_amount` decimal(15,2) DEFAULT NULL,
  `alert_status` tinyint(4) NOT NULL DEFAULT 1,
  `status` int(2) NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`price_alert_id`),
  KEY `fk_price_alert_table_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_price_alert_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table for perr-contact*/
CREATE TABLE IF NOT EXISTS `peer_contact` (
  `peer_contact_id` int(50) NOT NULL AUTO_INCREMENT,
  `applicant_id_from` int(50) NOT NULL DEFAULT 0,
  `applicant_id_to` int(50) NOT NULL DEFAULT 0,
  `contact_number` varchar(50) NOT NULL DEFAULT '0',
  `mobile_number` varchar(50) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '0',
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`peer_contact_id`),
  KEY `fk_perr_contact_table_applicant_id` (`applicant_id_from`),
  CONSTRAINT `fk_perr_contact_table_applicant_id` FOREIGN KEY (`applicant_id_from`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table for logs*/
CREATE TABLE IF NOT EXISTS `logs` (
  `logs_id` int(25) NOT NULL AUTO_INCREMENT,
  `email` varchar(25) NOT NULL,
  `status_code` int(25) NOT NULL,
  `request` longtext NOT NULL,
  `response` longtext NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`logs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table for JWT token verification*/
CREATE TABLE IF NOT EXISTS `sandbox_token_validator` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL,
  `member_token` varchar(2555) DEFAULT NULL,
  `member_id` varchar(225) DEFAULT NULL,
  `expiry` int(10) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table to store Runtime log configuration of modules*/
CREATE TABLE IF NOT EXISTS `server_logs` (
  `logs_id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(250) NOT NULL,
  `status` tinyint(4) DEFAULT 0,
  `log_level` int(11) DEFAULT NULL,
  PRIMARY KEY (`logs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Demo data for server_logs table*/
INSERT INTO `server_logs` VALUES
(1,'controller.account',1,3),
(2,'controller.address',1,3),
(3,'controller.businessDetails',1,3),
(4,'controller.businessOwner',1,3),
(5,'controller.businessRegistration',1,3),
(6,'controller.card',1,3),
(7,'controller.checkRate',1,3),
(8,'controller.commonCode',1,3),
(9,'controller.contact',1,3),
(10,'controller.country',1,3),
(11,'controller.currencyExchange',1,3),
(12,'controller.currencyRate',1,3),
(13,'controller.dashboardStatus',1,3),
(14,'controller.kycIdentity',1,3),
(15,'controller.loggerConfigure',1,3),
(16,'controller.kycStatus',1,3),
(17,'controller.login',1,3),
(18,'controller.moneyTransfer',1,3),
(19,'controller.otp',1,3),
(20,'controller.password',1,3),
(21,'controller.payments',1,3),
(22,'controller.signUp',1,3),
(23,'controller.transaction',1,3),
(24,'controller.upload',1,3),
(25,'model.account',1,3),
(26,'model.addressModel',1,3),
(27,'model.businessDetails',1,3),
(28,'model.businessModel',1,3),
(29,'model.businessOwner',1,3),
(30,'model.businessRegisterModel',1,3),
(31,'model.businessRegistration',1,3),
(32,'model.card',1,3),
(33,'model.checkRate',1,3),
(34,'model.contactModel',1,3),
(35,'model.country',1,3),
(36,'model.currencyExchangeModel',1,3),
(37,'model.currencyRateModel',1,3),
(38,'model.dashboardModel',1,3),
(39,'model.kyc',1,3),
(40,'model.loggerModel',1,3),
(41,'model.login',1,3),
(42,'model.mockModel',1,3),
(43,'model.moneyTransfer',1,3),
(44,'model.otp',1,3),
(45,'model.password',1,3),
(46,'model.payment',1,3),
(47,'model.responseHandlerModel',1,3),
(48,'model.responseHelperModel',1,3),
(49,'model.signUp',1,3),
(50,'model.tokenManager',1,3),
(51,'model.tokenModel',1,3),
(52,'model.transactionModel',1,3),
(53,'model.uploadModel',1,3),
(54,'model.userModel',1,3),
(55,'controller.personalSettings',1,3),
(56,'model.personalSettings',1,3);

/*Table for storing tokens*/
CREATE TABLE IF NOT EXISTS `token` (
  `token_id` int(10) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(10) DEFAULT NULL,
  `token` varchar(250) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`token_id`),
  KEY `fk_token_table_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_token_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table for storing sudit_logs*/
CREATE TABLE IF NOT EXISTS `audit_log` (
  `audit_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL DEFAULT '',
  `request` longtext NOT NULL DEFAULT '',
  PRIMARY KEY (`audit_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `OTPValidator` (
  `id` smallint(5) NOT NULL AUTO_INCREMENT,
  `emailOrMobile` varchar(250) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `isVerified` tinyint(4) DEFAULT 0,
  `isExpired` tinyint(4) DEFAULT 0,
  `created_on` datetime NOT NULL,
  `updated_on` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table to store schedule transfer records*/
CREATE TABLE IF NOT EXISTS `scheduled_transfer` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `refference_number` varchar(15) DEFAULT NULL,
  `applicant_id` int(11) NOT NULL,
  `transfer_time` datetime NOT NULL,
  `from_currency` varchar(5) DEFAULT NULL,
  `list_of_transaction` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` tinyint(1) unsigned zerofill DEFAULT 0,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `do_notify` char(3) DEFAULT NULL,
  `created_on` datetime DEFAULT '0000-00-00 00:00:00',
  `updated_on` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `fk_sceduled_transfer_applicant` (`applicant_id`),
  CONSTRAINT `fk_sceduled_transfer_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*Table to store transfer histories*/
CREATE TABLE IF NOT EXISTS `transfer_history` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL,
  `execution_time` datetime DEFAULT NULL,
  `no_of_transactions` smallint(6) DEFAULT 0,
  `total_amount` decimal(15,2) DEFAULT 0.00,
  `from_currency` varchar(5) DEFAULT NULL,
  `list_of_trans` longtext DEFAULT NULL,
  `no_of_success_trans` smallint(6) DEFAULT 0,
  `succ_trans_list` longtext DEFAULT NULL,
  `no_of_failed_trans` smallint(6) DEFAULT 0,
  `failed_trans_list` longtext DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_scheduled_transfer_history_applicant` (`applicant_id`),
  CONSTRAINT `fk_scheduled_transfer_history_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*To store profile privacy setting*/
CREATE TABLE IF NOT EXISTS `privacy` (
  `privacy_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) DEFAULT NULL,
  `doEmailNotify` tinyint(4) DEFAULT 1,
  `doPushNotify` tinyint(4) DEFAULT 1,
  `isVisible` tinyint(4) DEFAULT 1,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`privacy_id`),
  KEY `applicant_id` (`applicant_id`),
  CONSTRAINT `applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table to store counterparty of an user*/
CREATE TABLE IF NOT EXISTS `user_counterparty` (
  `counterparty_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `userId` smallint(6) DEFAULT 0,
  `counterparty` int(11) DEFAULT NULL,
  `full_name` varchar(50) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(250) NOT NULL,
  `country` smallint(6) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`counterparty_id`),
  KEY `FK_user_counterparty_accounts` (`counterparty`),
  CONSTRAINT `FK_user_counterparty_accounts` FOREIGN KEY (`counterparty`) REFERENCES `accounts` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



/*Table for business role mapping*/
CREATE TABLE IF NOT EXISTS `business_role_mapping` (
 	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`business_id` INT(11) NULL DEFAULT 0,
	`role_id` INT(11) NULL DEFAULT 0,
	`acl` LONGTEXT NULL DEFAULT NULL,
	`status` TINYINT(1) NULL DEFAULT 1,
	`created_on` DATETIME NULL DEFAULT NULL,
	`updated_on` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_business_role_mapping_business_id` (`business_id`),
  KEY `FK_business_role_mapping_role_id` (`role_id`),
  CONSTRAINT `FK_business_role_mapping_business_id` FOREIGN KEY (`business_id`) REFERENCES `business_details` (`business_id`),
  CONSTRAINT `FK_business_role_mapping_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table is used to store encrypted data*/
CREATE TABLE IF NOT EXISTS `secret_key` (
  `key_id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `secret_number` text NOT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`key_id`),
  KEY `fk_secret_key_applicant_id` (`applicant_id`),
  KEY `fk_secret_key_cards_id` (`card_id`),
  CONSTRAINT `fk_secret_key_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
  CONSTRAINT `fk_secret_key_cards_id` FOREIGN KEY (`card_id`) REFERENCES `payment_cards` (`payment_cards_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `card_Issue` (
  `card_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL,
  `product_type_id` int(11) NOT NULL,
  `card_pin` int(10) NOT NULL,
  `card_limit` int(10) NOT NULL,
  `card_base_currency` varchar(3) NOT NULL,
  `card_deliver_to` int(8) NOT NULL,
  `card_feewithdraw_account` int(11) NOT NULL,
  `card_name_in_card` varchar(50) NOT NULL,
  `card_number` varchar(25) NOT NULL,
  `card_expiry_date` varchar(10) DEFAULT NULL,
  `card_cvv` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`card_id`),
  KEY `fk_card_issue_applicant` (`applicant_id`),
  KEY `fk_card_issue_card_feewithdraw_account` (`card_feewithdraw_account`),
  CONSTRAINT `fk_card_issue_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
  CONSTRAINT `fk_card_issue_card_feewithdraw_account` FOREIGN KEY (`card_feewithdraw_account`) REFERENCES `accounts` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `card_linked_accounts` (
  `card_linked_accountid` int(11) NOT NULL AUTO_INCREMENT,
  `Card_id` smallint(6) NOT NULL,
  `card_linked_urrencyccount` varchar(25) NOT NULL,
  PRIMARY KEY (`card_linked_accountid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `card_type` (
  `card_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `card_type` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`card_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `card_product_type` (
  `card_product_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `card_product_name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`card_product_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `plan_name` (
	`plan_name_id` INT(11) NOT NULL AUTO_INCREMENT,
	`plan_type` VARCHAR(50) NULL DEFAULT NULL,
	`plan_subscription` INT(11) NULL DEFAULT NULL,
	`plan_image` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`created_on`  DATETIME NULL DEFAULT NULL,
	`updated_on`  DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`plan_name_id`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `plan_feature` (
	`plan_feature_id` INT(11) NOT NULL AUTO_INCREMENT,
	`plan_features` VARCHAR(50) NULL DEFAULT NULL,
	`created_on`  DATETIME NULL DEFAULT NULL,
	`updated_on`  DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`plan_feature_id`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `plans` (
	`plan_id` INT(11) NOT NULL AUTO_INCREMENT,
	`plan_name_id` INT(11) NULL DEFAULT NULL,
	`plan_feature_id` INT(11) NULL DEFAULT NULL,
	`free_allowances` INT(11) NULL DEFAULT NULL,
	`amount_charge` VARCHAR(50) NULL DEFAULT NULL,
	`created_on` DATETIME NULL DEFAULT NULL,
	`updated_on` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`plan_id`),
	INDEX `FK_plans_plan_name` (`plan_name_id`),
	INDEX `FK_plans_plan_feature` (`plan_feature_id`),
	CONSTRAINT `FK_plans_plan_feature` FOREIGN KEY (`plan_feature_id`) REFERENCES `plan_feature` (`plan_feature_id`),
	CONSTRAINT `FK_plans_plan_name` FOREIGN KEY (`plan_name_id`) REFERENCES `plan_name` (`plan_name_id`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `user_plans` (
	`user_plan_id` INT(11) NOT NULL AUTO_INCREMENT,
	`applicant_id` INT(11) NULL DEFAULT NULL,
	`plan_id` INT(11) NULL DEFAULT NULL,
	`used_allowances` INT(11) NULL DEFAULT NULL,
	`plan_startDate`  DATETIME NULL DEFAULT NULL,
	`plan_endDate`  DATETIME NULL DEFAULT NULL,
	`created_on`  DATETIME NULL DEFAULT NULL,
	`updated_on`  DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`user_plan_id`),
	INDEX `FK_user_plans_applicant` (`applicant_id`),
	INDEX `FK_user_plans_plans` (`plan_id`),
	CONSTRAINT `FK_user_plans_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
	CONSTRAINT `FK_user_plans_plans` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;


INSERT INTO `global_country_list` (`country_id`, `country_name`, `isRestricted`) VALUES
	(1, 'Afghanistan', 1),
	(2, 'Aland Islands', 0),
	(3, 'Albania', 0),
	(4, 'Algeria', 1),
	(5, 'American Samoa', 0),
	(6, 'Andorra', 0),
	(7, 'Angola', 1),
	(8, 'Anguilla', 0),
	(9, 'Antarctica', 0),
	(10, 'Antigua and Barbuda', 0),
	(11, 'Argentina', 0),
	(12, 'Armenia', 0),
	(13, 'Aruba', 0),
	(14, 'Australia', 0),
	(15, 'Austria', 0),
	(16, 'Azerbaijan', 0),
	(17, 'Bahamas', 0),
	(18, 'Bahrain', 0),
	(19, 'Bangladesh', 0),
	(20, 'Barbados', 0),
	(21, 'Belarus', 1),
	(22, 'Belgium', 0),
	(23, 'Belize', 0),
	(24, 'Benin', 0),
	(25, 'Bermuda', 0),
	(26, 'Bhutan', 0),
	(27, 'Bolivia (Plurinational State of)', 0),
	(28, 'Bonaire, Sint Eustatius and Saba', 0),
	(29, 'Bosnia and Herzegovina', 1),
	(30, 'Botswana', 0),
	(31, 'Bouvet Island', 0),
	(32, 'Brazil', 0),
	(33, 'British Indian Ocean Territory', 0),
	(34, 'United States Minor Outlying Islands', 0),
	(35, 'Virgin Islands (British)', 0),
	(36, 'Virgin Islands (U.S.)', 0),
	(37, 'Brunei Darussalam', 0),
	(38, 'Bulgaria', 0),
	(39, 'Burkina Faso', 1),
	(40, 'Burundi', 1),
	(41, 'Cambodia', 1),
	(42, 'Cameroon', 0),
	(43, 'Canada', 0),
	(44, 'Cabo Verde', 0),
	(45, 'Cayman Islands', 0),
	(46, 'Central African Republic', 0),
	(47, 'Chad', 0),
	(48, 'Chile', 0),
	(49, 'China', 0),
	(50, 'Christmas Island', 0),
	(51, 'Cocos (Keeling) Islands', 0),
	(52, 'Colombia', 0),
	(53, 'Comoros', 0),
	(54, 'Congo', 0),
	(55, 'Congo (Democratic Republic of the)', 0),
	(56, 'Cook Islands', 0),
	(57, 'Costa Rica', 0),
	(58, 'Croatia', 0),
	(59, 'Cuba', 1),
	(60, 'Curaçao', 0),
	(61, 'Cyprus', 0),
	(62, 'Czech Republic', 0),
	(63, 'Denmark', 0),
	(64, 'Djibouti', 0),
	(65, 'Dominica', 0),
	(66, 'Dominican Republic', 0),
	(67, 'Ecuador', 0),
	(68, 'Egypt', 1),
	(69, 'El Salvador', 0),
	(70, 'Equatorial Guinea', 0),
	(71, 'Eritrea', 1),
	(72, 'Estonia', 0),
	(73, 'Ethiopia', 0),
	(74, 'Falkland Islands (Malvinas)', 0),
	(75, 'Faroe Islands', 0),
	(76, 'Fiji', 0),
	(77, 'Finland', 0),
	(78, 'France', 0),
	(79, 'French Guiana', 0),
	(80, 'French Polynesia', 0),
	(81, 'French Southern Territories', 0),
	(82, 'Gabon', 0),
	(83, 'Gambia', 0),
	(84, 'Georgia', 0),
	(85, 'Germany', 0),
	(86, 'Ghana', 0),
	(87, 'Gibraltar', 0),
	(88, 'Greece', 0),
	(89, 'Greenland', 0),
	(90, 'Grenada', 0),
	(91, 'Guadeloupe', 0),
	(92, 'Guam', 0),
	(93, 'Guatemala', 0),
	(94, 'Guernsey', 0),
	(95, 'Guinea', 1),
	(96, 'Guinea-Bissau', 1),
	(97, 'Guyana', 1),
	(98, 'Haiti', 1),
	(99, 'Heard Island and McDonald Islands', 0),
	(100, 'Holy See', 0),
	(101, 'Honduras', 0),
	(102, 'Hong Kong', 0),
	(103, 'Hungary', 0),
	(104, 'Iceland', 0),
	(105, 'India', 0),
	(106, 'Indonesia', 0),
	(107, 'Iran (Islamic Republic of)', 1),
	(108, 'Iraq', 1),
	(109, 'Ireland', 0),
	(110, 'Isle of Man', 0),
	(111, 'Israel', 0),
	(112, 'Italy', 0),
	(113, 'Jamaica', 0),
	(114, 'Japan', 0),
	(115, 'Jersey', 0),
	(116, 'Jordan', 0),
	(117, 'Kazakhstan', 0),
	(118, 'Kenya', 0),
	(119, 'Kiribati', 0),
	(120, 'Kuwait', 0),
	(121, 'Kyrgyzstan', 0),
	(122, 'Latvia', 0),
	(123, 'Lebanon', 1),
	(124, 'Lesotho', 0),
	(125, 'Liberia', 1),
	(126, 'Libya', 1),
	(127, 'Liechtenstein', 0),
	(128, 'Lithuania', 0),
	(129, 'Luxembourg', 0),
	(130, 'Macao', 0),
	(131, 'Macedonia ', 0),
	(132, 'Madagascar', 0),
	(133, 'Malawi', 0),
	(134, 'Malaysia', 0),
	(135, 'Maldives', 0),
	(136, 'Mali', 0),
	(137, 'Malta', 0),
	(138, 'Marshall Islands', 0),
	(139, 'Martinique', 0),
	(140, 'Mauritania', 0),
	(141, 'Mauritius', 0),
	(142, 'Mayotte', 0),
	(143, 'Mexico', 0),
	(144, 'Micronesia (Federated States of)', 0),
	(145, 'Moldova (Republic of)', 0),
	(146, 'Monaco', 0),
	(147, 'Mongolia', 0),
	(148, 'Montenegro', 0),
	(149, 'Montserrat', 0),
	(150, 'Morocco', 0),
	(151, 'Mozambique', 1),
	(152, 'Myanmar', 1),
	(153, 'Namibia', 0),
	(154, 'Nauru', 0),
	(155, 'Nepal', 0),
	(156, 'Netherlands', 0),
	(157, 'New Caledonia', 0),
	(158, 'New Zealand', 0),
	(159, 'Nicaragua', 0),
	(160, 'Niger', 0),
	(161, 'Nigeria', 1),
	(162, 'Niue', 0),
	(163, 'Norfolk Island', 0),
	(164, 'Northern Mariana Islands', 0),
	(165, 'Norway', 0),
	(166, 'Oman', 0),
	(167, 'Pakistan', 1),
	(168, 'Palau', 0),
	(169, 'Palestine, State of', 0),
	(170, 'Panama', 1),
	(171, 'Papua New Guinea', 0),
	(172, 'Paraguay', 0),
	(173, 'Peru', 0),
	(174, 'Philippines', 0),
	(175, 'Pitcairn', 0),
	(176, 'Poland', 0),
	(177, 'Portugal', 0),
	(178, 'Puerto Rico', 0),
	(179, 'Qatar', 0),
	(180, 'Republic of Kosovo', 0),
	(181, 'Réunion', 0),
	(182, 'Romania', 0),
	(183, 'Russian Federation', 0),
	(184, 'Rwanda', 0),
	(185, 'Saint Barthélemy', 0),
	(186, 'St Helena, Ascension & Tristan da Cunha', 0),
	(187, 'Saint Kitts and Nevis', 0),
	(188, 'Saint Lucia', 0),
	(189, 'Saint Martin (French part)', 0),
	(190, 'Saint Pierre and Miquelon', 0),
	(191, 'Saint Vincent and the Grenadines', 0),
	(192, 'Samoa', 0),
	(193, 'San Marino', 0),
	(194, 'Sao Tome and Principe', 0),
	(195, 'Saudi Arabia', 0),
	(196, 'Senegal', 0),
	(197, 'Serbia', 0),
	(198, 'Seychelles', 0),
	(199, 'Sierra Leone', 1),
	(200, 'Singapore', 0),
	(201, 'Sint Maarten (Dutch part)', 0),
	(202, 'Slovakia', 0),
	(203, 'Slovenia', 0),
	(204, 'Solomon Islands', 0),
	(205, 'Somalia', 1),
	(206, 'South Africa', 0),
	(207, 'South Georgia & Sandwich Islands', 0),
	(208, 'Korea (Republic of)', 0),
	(209, 'South Sudan', 1),
	(210, 'Spain', 0),
	(211, 'Sri Lanka', 0),
	(212, 'Sudan', 1),
	(213, 'Suriname', 0),
	(214, 'Svalbard and Jan Mayen', 0),
	(215, 'Swaziland', 1),
	(216, 'Sweden', 0),
	(217, 'Switzerland', 0),
	(218, 'Syrian Arab Republic', 1),
	(219, 'Taiwan', 0),
	(220, 'Tajikistan', 1),
	(221, 'Tanzania, United Republic of', 0),
	(222, 'Thailand', 0),
	(223, 'Timor-Leste', 1),
	(224, 'Togo', 0),
	(225, 'Tokelau', 0),
	(226, 'Tonga', 0),
	(227, 'Trinidad and Tobago', 0),
	(228, 'Tunisia', 1),
	(229, 'Turkey', 0),
	(230, 'Turkmenistan', 0),
	(231, 'Turks and Caicos Islands', 0),
	(232, 'Tuvalu', 0),
	(233, 'Uganda', 1),
	(234, 'Ukraine', 1),
	(235, 'United Arab Emirates', 0),
	(236, 'United Kingdom', 0),
	(237, 'United States of America', 0),
	(238, 'Uruguay', 0),
	(239, 'Uzbekistan', 0),
	(240, 'Vanuatu', 1),
	(241, 'Venezuela (Bolivarian Republic of)', 1),
	(242, 'Viet Nam', 0),
	(243, 'Wallis and Futuna', 0),
	(244, 'Western Sahara', 0),
	(245, 'Yemen', 1),
	(246, 'Zambia', 0),
	(247, 'Zimbabwe', 1),
	(248, 'Korea (Democratic People\'s Republic of)', 1),
	(249, 'Lao People\'s Democratic Republic', 1),
	(250, 'Côte d\'Ivoire', 1);