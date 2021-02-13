/*This file is the updated version of previous DataBase scripts.*/
/*
1. Version = 0.1.
2. Mariadb Version = 10.3.20.
3. Number of table created = 4.
4. Number of table altered = 7.
*/

/*Altered table based upun new design and requirement*/
ALTER TABLE `applicant`
ADD COLUMN (`customerId` varchar(15) DEFAULT NULL,
            `user_id` varchar(250) DEFAULT NULL,
            `password` varchar(100) DEFAULT NULL,
            `passcode_pin` varchar(250) DEFAULT NULL,
            `mobile` varchar(15) DEFAULT NULL,
            `role_id` int(11) DEFAULT NULL,
            `status` tinyint(1) DEFAULT 1,
            `otp` varchar(10) DEFAULT NULL);

ALTER TABLE `kyc`
ADD COLUMN (
   `pep_status` varchar(50) DEFAULT NULL,
   `sanctions_status` varchar(50) DEFAULT NULL,
   `created_on` datetime DEFAULT NULL,
   `updated_on` datetime DEFAULT NULL
);

ALTER TABLE `kyb_business`
ADD COLUMN (
  `updated_on` datetime DEFAULT NULL,
  `created_on` datetime DEFAULT NULL
);

ALTER TABLE `payment_cards`
ADD COLUMN (
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL
);


ALTER TABLE `payments`
ADD COLUMN (
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL
);

ALTER TABLE `transactions`
ADD COLUMN `description` varchar(250) DEFAULT NULL;

ALTER TABLE `audit_log`
ADD COLUMN (
  `ip` varchar(25) DEFAULT NULL,
  `request_path` varchar(200) DEFAULT NULL,
  `requested_method` varchar(10) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL
);

/*To store merchent related data*/
CREATE TABLE `merchant` (
    `merchant_id` INT(11) NOT NULL AUTO_INCREMENT,
    `applicant_id` INT(11) NULL DEFAULT NULL,
    `memberId` VARCHAR(100) NULL DEFAULT NULL,
    `api_key` VARCHAR(100) NULL DEFAULT NULL,
    `url` VARCHAR(150) NULL DEFAULT NULL,
    `api_doc_url` VARCHAR(150) NULL DEFAULT NULL,
    `redirect_url` VARCHAR(150) NULL DEFAULT NULL,
    `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_on` DATETIME NULL DEFAULT '0000-00-00 00:00:00',
    PRIMARY KEY (`merchant_id`),
    INDEX `fk_payvoo_merchant_table_applicant_id` (`applicant_id`),
    CONSTRAINT `fk_payvoo_merchant_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB;

/*To store merchent order details*/
CREATE TABLE `merchant_order_details` (
    `order_id` VARCHAR(50) NOT NULL,
    `applicant_id` INT(11) NULL DEFAULT NULL,
    `success_url` VARCHAR(150) NULL DEFAULT NULL,
    `failure_url` VARCHAR(150) NULL DEFAULT NULL,
    `amount` FLOAT NULL DEFAULT NULL,
    `currency` VARCHAR(5) NULL DEFAULT NULL,
    `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_on` DATETIME NULL DEFAULT '0000-00-00 00:00:00',
    PRIMARY KEY (`order_id`),
    INDEX `fk_payvoo_merchant_order_details_table_applicant_id` (`applicant_id`),
    CONSTRAINT `fk_payvoo_merchant_order_details_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB;

/*To store sandbox order details data*/
CREATE TABLE `sandbox_order_details` (
    `order_id` VARCHAR(50) NOT NULL,
    `applicant_id` INT(11) NULL DEFAULT NULL,
    `success_url` VARCHAR(150) NULL DEFAULT NULL,
    `failure_url` VARCHAR(150) NULL DEFAULT NULL,
    `amount` FLOAT NULL DEFAULT NULL,
    `currency` VARCHAR(5) NULL DEFAULT NULL,
    `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_on` DATETIME NULL DEFAULT '0000-00-00 00:00:00',
    PRIMARY KEY (`order_id`),
    INDEX `fk_payvoo_sandbox_order_details_table_applicant_id` (`applicant_id`),
    CONSTRAINT `fk_payvoo_sandbox_order_details_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB;

/*To store sandbox transaction details*/
CREATE TABLE `sandbox_transactions` (
    `transaction_id` INT(11) NOT NULL AUTO_INCREMENT,
    `applicant_id` INT(11) NULL DEFAULT NULL,
    `transaction_number` VARCHAR(50) NULL DEFAULT NULL,
    `transaction_type` ENUM('DB','CR') NULL DEFAULT NULL,
    `from_account` INT(11) NOT NULL DEFAULT '0',
    `to_account` INT(11) NOT NULL DEFAULT '0',
    `currency_type` VARCHAR(5) NOT NULL DEFAULT '',
    `counterparty` VARCHAR(100) NULL DEFAULT NULL,
    `account_type` VARCHAR(15) NULL DEFAULT NULL,
    `amount` DECIMAL(15,2) NULL DEFAULT '0',
    `created_on` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (`transaction_id`),
    INDEX `fk_sandbox_transaction_table_applicant_id` (`applicant_id`),
    INDEX `fk_sandbox_transaction_table_from_account` (`from_account`),
    INDEX `fk_sandbox_transaction_table_to_account` (`to_account`),
    INDEX `fk_sandbox_transaction_table_currency_type` (`currency_type`),
    CONSTRAINT `fk_sandbox_transaction_table_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`applicant_id`),
    CONSTRAINT `fk_sandbox_transaction_table_from_account` FOREIGN KEY (`from_account`) REFERENCES `accounts` (`account_no`),
    CONSTRAINT `fk_sandbox_transaction_table_to_account` FOREIGN KEY (`to_account`) REFERENCES `accounts` (`account_no`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB;
 
 

















