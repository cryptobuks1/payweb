CREATE TABLE IF NOT EXISTS `non_payvoo_user_payments` (
  `payment_id` varchar(45) DEFAULT NULL,
  `receiver_name` varchar(45) DEFAULT NULL,
  `receiver_email` varchar(45) DEFAULT NULL,
  `receiver_mobile` varchar(45) DEFAULT NULL,
  `currency` varchar(3) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `sender_name` varchar(45) DEFAULT NULL,
  `sender_email` varchar(45) DEFAULT NULL,
  `sender_applicant_id` int(11) DEFAULT NULL,
  `is_money_received` int(1) DEFAULT NULL,
  PRIMARY KEY (`payment_id`)
);