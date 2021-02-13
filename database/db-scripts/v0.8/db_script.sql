ALTER TABLE `kyb_business_owner`
ADD COLUMN IF NOT EXISTS `is_primary_applicant` TINYINT(4) NOT NULL default 0;