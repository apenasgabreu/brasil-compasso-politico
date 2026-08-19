CREATE TABLE `result_vault_rate_limits` (
	`keyHash` varchar(64) NOT NULL,
	`windowStartedAt` timestamp NOT NULL,
	`saveCount` int NOT NULL DEFAULT 0,
	`loadCount` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `result_vault_rate_limits_keyHash` PRIMARY KEY(`keyHash`)
);
