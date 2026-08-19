CREATE TABLE `encrypted_result_vaults` (
	`id` varchar(64) NOT NULL,
	`ciphertext` text NOT NULL,
	`iv` varchar(64) NOT NULL,
	`version` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `encrypted_result_vaults_id` PRIMARY KEY(`id`)
);
