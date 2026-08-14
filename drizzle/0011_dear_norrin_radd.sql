CREATE TABLE `linux_fix_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixId` int NOT NULL,
	`authorId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`observation` text NOT NULL,
	`reproduction` text NOT NULL,
	`suggestedSteps` text NOT NULL,
	`sourceUrl` varchar(2048),
	`contextSnapshot` json,
	`contextSharedAt` timestamp,
	`status` enum('submitted','in_review','accepted','rejected','withdrawn') NOT NULL DEFAULT 'submitted',
	`reviewerId` int,
	`reviewNote` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `linux_fix_proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `linux_fix_proposals` ADD CONSTRAINT `linux_fix_proposals_fixId_linux_fixes_id_fk` FOREIGN KEY (`fixId`) REFERENCES `linux_fixes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_proposals` ADD CONSTRAINT `linux_fix_proposals_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_proposals` ADD CONSTRAINT `linux_fix_proposals_reviewerId_users_id_fk` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `linux_fix_proposals_fix_status_idx` ON `linux_fix_proposals` (`fixId`,`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `linux_fix_proposals_author_idx` ON `linux_fix_proposals` (`authorId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `linux_fix_proposals_status_idx` ON `linux_fix_proposals` (`status`,`createdAt`);