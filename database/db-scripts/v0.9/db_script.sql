ALTER TABLE `business_role_mapping`
ADD COLUMN (`first_name` varchar(250) DEFAULT NULL),
ADD COLUMN (`last_name` varchar(250) DEFAULT NULL),
ADD COLUMN (`email` varchar(250) DEFAULT NULL);
