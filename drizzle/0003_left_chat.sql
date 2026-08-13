CREATE TABLE `linux_fix_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixId` int NOT NULL,
	`userId` int NOT NULL,
	`body` text NOT NULL,
	`isSolution` boolean NOT NULL DEFAULT false,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `linux_fix_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `linux_fix_confirmations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixId` int NOT NULL,
	`solutionId` int,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `linux_fix_confirmations_id` PRIMARY KEY(`id`),
	CONSTRAINT `linux_fix_confirmations_user_fix_unique` UNIQUE(`userId`,`fixId`)
);
--> statement-breakpoint
CREATE TABLE `linux_fix_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixId` int NOT NULL,
	`userId` int NOT NULL,
	`value` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `linux_fix_votes_id` PRIMARY KEY(`id`),
	CONSTRAINT `linux_fix_votes_user_fix_unique` UNIQUE(`userId`,`fixId`)
);
--> statement-breakpoint
CREATE TABLE `setup_guide_step_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`guideStepId` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `setup_guide_step_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `setup_guide_step_progress_user_step_unique` UNIQUE(`userId`,`guideStepId`)
);
--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `storageDescription` varchar(255);--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `monitorDescription` varchar(255);--> statement-breakpoint
ALTER TABLE `linux_fix_comments` ADD CONSTRAINT `linux_fix_comments_fixId_linux_fixes_id_fk` FOREIGN KEY (`fixId`) REFERENCES `linux_fixes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_comments` ADD CONSTRAINT `linux_fix_comments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_confirmations` ADD CONSTRAINT `linux_fix_confirmations_fixId_linux_fixes_id_fk` FOREIGN KEY (`fixId`) REFERENCES `linux_fixes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_confirmations` ADD CONSTRAINT `linux_fix_confirmations_solutionId_linux_fix_solutions_id_fk` FOREIGN KEY (`solutionId`) REFERENCES `linux_fix_solutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_confirmations` ADD CONSTRAINT `linux_fix_confirmations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_votes` ADD CONSTRAINT `linux_fix_votes_fixId_linux_fixes_id_fk` FOREIGN KEY (`fixId`) REFERENCES `linux_fixes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_votes` ADD CONSTRAINT `linux_fix_votes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guide_step_progress` ADD CONSTRAINT `setup_guide_step_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guide_step_progress` ADD CONSTRAINT `setup_guide_step_progress_guideStepId_setup_guide_steps_id_fk` FOREIGN KEY (`guideStepId`) REFERENCES `setup_guide_steps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `linux_fix_comments_fix_created_idx` ON `linux_fix_comments` (`fixId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `linux_fix_comments_user_idx` ON `linux_fix_comments` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `linux_fix_confirmations_fix_idx` ON `linux_fix_confirmations` (`fixId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `linux_fix_votes_fix_idx` ON `linux_fix_votes` (`fixId`,`value`);--> statement-breakpoint
CREATE INDEX `setup_guide_step_progress_user_idx` ON `setup_guide_step_progress` (`userId`,`completedAt`);