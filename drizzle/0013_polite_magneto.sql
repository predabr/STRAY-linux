CREATE TABLE `user_sync_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`syncFavorites` boolean NOT NULL DEFAULT true,
	`syncSavedGuides` boolean NOT NULL DEFAULT true,
	`syncLinuxFixHistory` boolean NOT NULL DEFAULT true,
	`syncManualProfiles` boolean NOT NULL DEFAULT true,
	`syncTechnicalSnapshot` boolean NOT NULL DEFAULT false,
	`consentedAt` timestamp NOT NULL DEFAULT (now()),
	`lastReviewedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_sync_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_sync_preferences_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `user_sync_preferences` ADD CONSTRAINT `user_sync_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;