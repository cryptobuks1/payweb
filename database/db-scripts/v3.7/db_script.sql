
CREATE TABLE IF NOT EXISTS `devicetypes` (
  `device_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `device_type_name` varchar(50) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`device_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `devicetypes` (`device_type_id`, `device_type_name`) VALUES
	(1, 'iOS'),
	(2, 'Andriod');
  


ALTER TABLE `applicant`
ADD COLUMN `devicetype` INT NULL,
ADD COLUMN `devicetoken` VARCHAR(250) NULL;