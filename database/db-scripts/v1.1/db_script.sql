ALTER TABLE `user_counterparty` DROP FOREIGN KEY FK_user_counterparty_accounts;

ALTER TABLE `user_counterparty` ADD COLUMN (`is_non_payvoo_user` INT DEFAULT 0);