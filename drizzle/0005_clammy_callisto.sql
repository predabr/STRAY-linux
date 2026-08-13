CREATE TABLE `game_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameId` int NOT NULL,
	`kind` enum('cover','header','screenshot','logo') NOT NULL,
	`imageUrl` varchar(2048) NOT NULL,
	`sourceUrl` varchar(2048),
	`sourceId` int,
	`width` int,
	`height` int,
	`position` int NOT NULL DEFAULT 0,
	`sourceCheckedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_media_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_media_game_kind_position_unique` UNIQUE(`gameId`,`kind`,`position`)
);
--> statement-breakpoint
CREATE TABLE `source_refresh_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int NOT NULL,
	`kind` varchar(64) NOT NULL,
	`status` enum('started','succeeded','failed','skipped') NOT NULL,
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`finishedAt` timestamp,
	`recordsSeen` int NOT NULL DEFAULT 0,
	`recordsChanged` int NOT NULL DEFAULT 0,
	`inputHash` varchar(128),
	`sourceEndpoint` varchar(2048),
	`message` text,
	CONSTRAINT `source_refresh_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `content_sources` ADD `lastCheckedAt` timestamp;--> statement-breakpoint
ALTER TABLE `content_sources` ADD `lastSuccessfulRefreshAt` timestamp;--> statement-breakpoint
ALTER TABLE `games` ADD `sourceUpdatedAt` timestamp;--> statement-breakpoint
ALTER TABLE `games` ADD `sourceCheckedAt` timestamp;--> statement-breakpoint
ALTER TABLE `game_media` ADD CONSTRAINT `game_media_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_media` ADD CONSTRAINT `game_media_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `source_refresh_runs` ADD CONSTRAINT `source_refresh_runs_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `game_media_game_kind_idx` ON `game_media` (`gameId`,`kind`);--> statement-breakpoint
CREATE INDEX `source_refresh_runs_source_requested_idx` ON `source_refresh_runs` (`sourceId`,`requestedAt`);--> statement-breakpoint
CREATE INDEX `source_refresh_runs_status_idx` ON `source_refresh_runs` (`status`,`requestedAt`);