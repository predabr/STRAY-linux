CREATE TABLE `audit_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` int NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `benchmark_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`benchmarkId` int NOT NULL,
	`resolutionWidth` int NOT NULL,
	`resolutionHeight` int NOT NULL,
	`preset` varchar(160) NOT NULL,
	`averageFps` decimal(8,2),
	`onePercentLowFps` decimal(8,2),
	`zeroPointOnePercentLowFps` decimal(8,2),
	`temperatureC` decimal(6,2),
	`powerWatts` decimal(8,2),
	`calculationMethod` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `benchmark_results_id` PRIMARY KEY(`id`),
	CONSTRAINT `benchmark_results_unique_combo` UNIQUE(`benchmarkId`,`resolutionWidth`,`resolutionHeight`,`preset`)
);
--> statement-breakpoint
CREATE TABLE `benchmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameId` int NOT NULL,
	`userId` int,
	`hardwareProfileId` int,
	`cpuId` int,
	`gpuId` int,
	`ramId` int,
	`distributionId` int,
	`distributionVersionId` int,
	`gameVersion` varchar(160),
	`kernelVersion` varchar(160),
	`driverVersion` varchar(160),
	`mesaVersion` varchar(160),
	`nvidiaVersion` varchar(160),
	`protonVersion` varchar(160),
	`wineVersion` varchar(160),
	`runtimeVersion` varchar(160),
	`sourceType` enum('community_submission','imported_source','admin_entry','calculated_estimate') NOT NULL,
	`provenance` enum('verified','community','estimated','unknown') NOT NULL DEFAULT 'community',
	`verificationStatus` enum('submitted','in_review','verified','rejected') NOT NULL DEFAULT 'submitted',
	`sourceLabel` varchar(255),
	`sourceUrl` varchar(2048),
	`evidenceNote` text,
	`reviewedById` int,
	`reviewedAt` timestamp,
	`reviewNote` text,
	`measuredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `benchmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`role` varchar(32) NOT NULL,
	`content` text NOT NULL,
	`citations` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255),
	`provider` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compatibility_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fingerprint` varchar(160) NOT NULL,
	`gameId` int NOT NULL,
	`distributionId` int,
	`distributionVersionId` int,
	`cpuId` int,
	`gpuId` int,
	`kernelConstraint` varchar(255),
	`driverConstraint` varchar(255),
	`protonVersion` varchar(160),
	`wineVersion` varchar(160),
	`runtimeVersion` varchar(160),
	`gameVersion` varchar(160),
	`level` enum('excellent','good','playable','limited','broken','unknown') NOT NULL DEFAULT 'unknown',
	`provenance` enum('verified','community','estimated','unknown') NOT NULL DEFAULT 'unknown',
	`confidence` enum('high','medium','low','unknown') NOT NULL DEFAULT 'unknown',
	`summary` text,
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`reviewedById` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `compatibility_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `compatibility_records_fingerprint_unique` UNIQUE(`fingerprint`)
);
--> statement-breakpoint
CREATE TABLE `compatibility_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`compatibilityId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`body` text NOT NULL,
	`isConfirmed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `compatibility_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`baseUrl` varchar(2048),
	`licenseNote` text,
	`isOfficial` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_sources_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `distribution_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`distributionId` int NOT NULL,
	`version` varchar(100) NOT NULL,
	`codename` varchar(160),
	`defaultKernel` varchar(160),
	`isSupported` boolean NOT NULL DEFAULT true,
	`releaseDate` varchar(64),
	`endOfLife` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `distribution_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `distribution_versions_unique` UNIQUE(`distributionId`,`version`)
);
--> statement-breakpoint
CREATE TABLE `distributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`family` varchar(120),
	`packageManager` varchar(120),
	`defaultDesktop` varchar(160),
	`logoUrl` varchar(2048),
	`officialUrl` varchar(2048),
	`gamingScore` int,
	`scoreProvenance` enum('verified','community','estimated','unknown') NOT NULL DEFAULT 'unknown',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `distributions_id` PRIMARY KEY(`id`),
	CONSTRAINT `distributions_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gameId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorites_user_game_unique` UNIQUE(`userId`,`gameId`)
);
--> statement-breakpoint
CREATE TABLE `game_platforms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameId` int NOT NULL,
	`platform` varchar(48) NOT NULL,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`isWorking` boolean NOT NULL DEFAULT true,
	`antiCheat` varchar(160),
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_platforms_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_platforms_game_platform_unique` UNIQUE(`gameId`,`platform`)
);
--> statement-breakpoint
CREATE TABLE `game_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gameId` int NOT NULL,
	`score` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_ratings_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_ratings_user_game_unique` UNIQUE(`userId`,`gameId`)
);
--> statement-breakpoint
CREATE TABLE `game_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameId` int NOT NULL,
	`tagId` int NOT NULL,
	CONSTRAINT `game_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_tags_game_tag_unique` UNIQUE(`gameId`,`tagId`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(400) NOT NULL,
	`steamAppId` int,
	`shortDescription` varchar(600),
	`description` text,
	`developer` varchar(255),
	`publisher` varchar(255),
	`releaseDate` varchar(64),
	`coverImageUrl` varchar(2048),
	`websiteUrl` varchar(2048),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`sourceId` int,
	`importBatchId` int,
	`sourceUrl` varchar(2048),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `games_id` PRIMARY KEY(`id`),
	CONSTRAINT `games_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `games_steam_app_unique` UNIQUE(`steamAppId`)
);
--> statement-breakpoint
CREATE TABLE `hardware_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(220) NOT NULL,
	`kind` enum('cpu','gpu','ram') NOT NULL,
	`manufacturer` varchar(160) NOT NULL,
	`model` varchar(255) NOT NULL,
	`architecture` varchar(160),
	`vramMb` int,
	`cores` int,
	`threads` int,
	`baseClockMhz` int,
	`boostClockMhz` int,
	`tdpWatts` int,
	`ramCapacityGb` int,
	`ramFrequencyMhz` int,
	`ramType` varchar(80),
	`driverFamily` varchar(160),
	`vulkanVersion` varchar(80),
	`openGlVersion` varchar(80),
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hardware_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `hardware_items_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `import_batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int,
	`kind` varchar(64) NOT NULL,
	`inputHash` varchar(128),
	`importedCount` int NOT NULL DEFAULT 0,
	`importedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	CONSTRAINT `import_batches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `linux_fix_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fixId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `linux_fix_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `linux_fix_solutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixId` int NOT NULL,
	`stepOrder` int NOT NULL,
	`title` varchar(400) NOT NULL,
	`explanation` text,
	`command` text,
	`warning` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `linux_fix_solutions_id` PRIMARY KEY(`id`),
	CONSTRAINT `linux_fix_solutions_order_unique` UNIQUE(`fixId`,`stepOrder`)
);
--> statement-breakpoint
CREATE TABLE `linux_fixes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(400) NOT NULL,
	`category` enum('steam','proton','wine','vulkan','amd','nvidia','intel','anti_cheat','audio','controller','fps','stuttering','crashes','black_screen','launch_errors','other') NOT NULL,
	`symptoms` text NOT NULL,
	`possibleCauses` text NOT NULL,
	`gameId` int,
	`distributionId` int,
	`hardwareId` int,
	`affectedVersion` varchar(160),
	`confidence` enum('high','medium','low','unknown') NOT NULL DEFAULT 'unknown',
	`provenance` enum('verified','community','estimated','unknown') NOT NULL DEFAULT 'unknown',
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`authorId` int,
	`reviewedById` int,
	`reviewedAt` timestamp,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `linux_fixes_id` PRIMARY KEY(`id`),
	CONSTRAINT `linux_fixes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`subjectType` varchar(80) NOT NULL,
	`subjectId` int NOT NULL,
	`type` enum('incorrect_information','invalid_benchmark','duplicate','broken_link','inappropriate_content','spam','other') NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','in_review','resolved','rejected') NOT NULL DEFAULT 'open',
	`reviewerId` int,
	`resolution` text,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`guideId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_guides_id` PRIMARY KEY(`id`),
	CONSTRAINT `saved_guides_user_guide_unique` UNIQUE(`userId`,`guideId`)
);
--> statement-breakpoint
CREATE TABLE `setup_guide_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guideId` int NOT NULL,
	`stepOrder` int NOT NULL,
	`title` varchar(400) NOT NULL,
	`explanation` text,
	`command` text,
	`warning` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `setup_guide_steps_id` PRIMARY KEY(`id`),
	CONSTRAINT `setup_guide_steps_order_unique` UNIQUE(`guideId`,`stepOrder`)
);
--> statement-breakpoint
CREATE TABLE `setup_guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(400) NOT NULL,
	`description` text,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL,
	`guideVersion` varchar(120),
	`distributionId` int,
	`distributionVersionId` int,
	`gameId` int,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`provenance` enum('verified','community','estimated','unknown') NOT NULL DEFAULT 'unknown',
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`authorId` int,
	`reviewedById` int,
	`reviewedAt` timestamp,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `setup_guides_id` PRIMARY KEY(`id`),
	CONSTRAINT `setup_guides_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(140) NOT NULL,
	`kind` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_hardware_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(140) NOT NULL,
	`cpuId` int,
	`gpuId` int,
	`ramId` int,
	`distributionId` int,
	`distributionVersionId` int,
	`kernelVersion` varchar(160),
	`driverVersion` varchar(160),
	`protonVersion` varchar(160),
	`isActive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_hardware_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_hardware_profiles_user_name_unique` UNIQUE(`userId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `wiki_articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(400) NOT NULL,
	`excerpt` varchar(600),
	`body` text NOT NULL,
	`distributionId` int,
	`distributionVersionId` int,
	`category` varchar(120) NOT NULL,
	`versionLabel` varchar(120),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`provenance` enum('verified','community','estimated','unknown') NOT NULL DEFAULT 'unknown',
	`sourceId` int,
	`sourceUrl` varchar(2048),
	`authorId` int,
	`reviewedById` int,
	`reviewedAt` timestamp,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wiki_articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `wiki_articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','moderator','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `isBanned` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `bannedAt` timestamp;--> statement-breakpoint
ALTER TABLE `audit_actions` ADD CONSTRAINT `audit_actions_actorId_users_id_fk` FOREIGN KEY (`actorId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmark_results` ADD CONSTRAINT `benchmark_results_benchmarkId_benchmarks_id_fk` FOREIGN KEY (`benchmarkId`) REFERENCES `benchmarks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_hardwareProfileId_user_hardware_profiles_id_fk` FOREIGN KEY (`hardwareProfileId`) REFERENCES `user_hardware_profiles`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_cpuId_hardware_items_id_fk` FOREIGN KEY (`cpuId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_gpuId_hardware_items_id_fk` FOREIGN KEY (`gpuId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_ramId_hardware_items_id_fk` FOREIGN KEY (`ramId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_distributionVersionId_distribution_versions_id_fk` FOREIGN KEY (`distributionVersionId`) REFERENCES `distribution_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benchmarks` ADD CONSTRAINT `benchmarks_reviewedById_users_id_fk` FOREIGN KEY (`reviewedById`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sessionId_chat_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_distributionVersionId_distribution_versions_id_fk` FOREIGN KEY (`distributionVersionId`) REFERENCES `distribution_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_cpuId_hardware_items_id_fk` FOREIGN KEY (`cpuId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_gpuId_hardware_items_id_fk` FOREIGN KEY (`gpuId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_records` ADD CONSTRAINT `compatibility_records_reviewedById_users_id_fk` FOREIGN KEY (`reviewedById`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_reports` ADD CONSTRAINT `compatibility_reports_compatibilityId_compatibility_records_id_fk` FOREIGN KEY (`compatibilityId`) REFERENCES `compatibility_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_reports` ADD CONSTRAINT `compatibility_reports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `distribution_versions` ADD CONSTRAINT `distribution_versions_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `distributions` ADD CONSTRAINT `distributions_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_platforms` ADD CONSTRAINT `game_platforms_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_platforms` ADD CONSTRAINT `game_platforms_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_ratings` ADD CONSTRAINT `game_ratings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_ratings` ADD CONSTRAINT `game_ratings_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_tags` ADD CONSTRAINT `game_tags_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_tags` ADD CONSTRAINT `game_tags_tagId_tags_id_fk` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_importBatchId_import_batches_id_fk` FOREIGN KEY (`importBatchId`) REFERENCES `import_batches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hardware_items` ADD CONSTRAINT `hardware_items_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_batches` ADD CONSTRAINT `import_batches_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_history` ADD CONSTRAINT `linux_fix_history_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_history` ADD CONSTRAINT `linux_fix_history_fixId_linux_fixes_id_fk` FOREIGN KEY (`fixId`) REFERENCES `linux_fixes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fix_solutions` ADD CONSTRAINT `linux_fix_solutions_fixId_linux_fixes_id_fk` FOREIGN KEY (`fixId`) REFERENCES `linux_fixes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fixes` ADD CONSTRAINT `linux_fixes_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fixes` ADD CONSTRAINT `linux_fixes_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fixes` ADD CONSTRAINT `linux_fixes_hardwareId_hardware_items_id_fk` FOREIGN KEY (`hardwareId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fixes` ADD CONSTRAINT `linux_fixes_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fixes` ADD CONSTRAINT `linux_fixes_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `linux_fixes` ADD CONSTRAINT `linux_fixes_reviewedById_users_id_fk` FOREIGN KEY (`reviewedById`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporterId_users_id_fk` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_reviewerId_users_id_fk` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saved_guides` ADD CONSTRAINT `saved_guides_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saved_guides` ADD CONSTRAINT `saved_guides_guideId_setup_guides_id_fk` FOREIGN KEY (`guideId`) REFERENCES `setup_guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guide_steps` ADD CONSTRAINT `setup_guide_steps_guideId_setup_guides_id_fk` FOREIGN KEY (`guideId`) REFERENCES `setup_guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guides` ADD CONSTRAINT `setup_guides_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guides` ADD CONSTRAINT `setup_guides_distributionVersionId_distribution_versions_id_fk` FOREIGN KEY (`distributionVersionId`) REFERENCES `distribution_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guides` ADD CONSTRAINT `setup_guides_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guides` ADD CONSTRAINT `setup_guides_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guides` ADD CONSTRAINT `setup_guides_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_guides` ADD CONSTRAINT `setup_guides_reviewedById_users_id_fk` FOREIGN KEY (`reviewedById`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD CONSTRAINT `user_hardware_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD CONSTRAINT `user_hardware_profiles_cpuId_hardware_items_id_fk` FOREIGN KEY (`cpuId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD CONSTRAINT `user_hardware_profiles_gpuId_hardware_items_id_fk` FOREIGN KEY (`gpuId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD CONSTRAINT `user_hardware_profiles_ramId_hardware_items_id_fk` FOREIGN KEY (`ramId`) REFERENCES `hardware_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD CONSTRAINT `user_hardware_profiles_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD CONSTRAINT `user_hardware_profiles_distributionVersionId_distribution_versions_id_fk` FOREIGN KEY (`distributionVersionId`) REFERENCES `distribution_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wiki_articles` ADD CONSTRAINT `wiki_articles_distributionId_distributions_id_fk` FOREIGN KEY (`distributionId`) REFERENCES `distributions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wiki_articles` ADD CONSTRAINT `wiki_articles_distributionVersionId_distribution_versions_id_fk` FOREIGN KEY (`distributionVersionId`) REFERENCES `distribution_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wiki_articles` ADD CONSTRAINT `wiki_articles_sourceId_content_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `content_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wiki_articles` ADD CONSTRAINT `wiki_articles_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wiki_articles` ADD CONSTRAINT `wiki_articles_reviewedById_users_id_fk` FOREIGN KEY (`reviewedById`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_actions_entity_idx` ON `audit_actions` (`entityType`,`entityId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `audit_actions_actor_idx` ON `audit_actions` (`actorId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `benchmark_results_resolution_idx` ON `benchmark_results` (`resolutionWidth`,`resolutionHeight`);--> statement-breakpoint
CREATE INDEX `benchmarks_game_status_idx` ON `benchmarks` (`gameId`,`verificationStatus`,`provenance`);--> statement-breakpoint
CREATE INDEX `benchmarks_hardware_idx` ON `benchmarks` (`gpuId`,`cpuId`,`distributionId`);--> statement-breakpoint
CREATE INDEX `benchmarks_user_idx` ON `benchmarks` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `chat_messages_session_idx` ON `chat_messages` (`sessionId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `chat_sessions_user_idx` ON `chat_sessions` (`userId`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `compatibility_records_lookup_idx` ON `compatibility_records` (`gameId`,`distributionId`,`gpuId`);--> statement-breakpoint
CREATE INDEX `compatibility_reports_record_idx` ON `compatibility_reports` (`compatibilityId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `distribution_versions_supported_idx` ON `distribution_versions` (`distributionId`,`isSupported`);--> statement-breakpoint
CREATE INDEX `distributions_status_idx` ON `distributions` (`status`);--> statement-breakpoint
CREATE INDEX `favorites_user_idx` ON `favorites` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `game_platforms_platform_idx` ON `game_platforms` (`platform`);--> statement-breakpoint
CREATE INDEX `game_ratings_game_idx` ON `game_ratings` (`gameId`,`score`);--> statement-breakpoint
CREATE INDEX `game_tags_tag_idx` ON `game_tags` (`tagId`);--> statement-breakpoint
CREATE INDEX `games_status_idx` ON `games` (`status`);--> statement-breakpoint
CREATE INDEX `games_title_idx` ON `games` (`title`);--> statement-breakpoint
CREATE INDEX `hardware_items_kind_manufacturer_idx` ON `hardware_items` (`kind`,`manufacturer`);--> statement-breakpoint
CREATE INDEX `import_batches_source_kind_idx` ON `import_batches` (`sourceId`,`kind`);--> statement-breakpoint
CREATE INDEX `linux_fix_history_user_idx` ON `linux_fix_history` (`userId`,`viewedAt`);--> statement-breakpoint
CREATE INDEX `linux_fixes_category_status_idx` ON `linux_fixes` (`category`,`status`);--> statement-breakpoint
CREATE INDEX `linux_fixes_game_idx` ON `linux_fixes` (`gameId`);--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `reports` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `reports_subject_idx` ON `reports` (`subjectType`,`subjectId`);--> statement-breakpoint
CREATE INDEX `saved_guides_user_idx` ON `saved_guides` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `setup_guides_distribution_status_idx` ON `setup_guides` (`distributionId`,`status`);--> statement-breakpoint
CREATE INDEX `setup_guides_game_idx` ON `setup_guides` (`gameId`);--> statement-breakpoint
CREATE INDEX `tags_kind_idx` ON `tags` (`kind`);--> statement-breakpoint
CREATE INDEX `user_hardware_profiles_active_idx` ON `user_hardware_profiles` (`userId`,`isActive`);--> statement-breakpoint
CREATE INDEX `wiki_articles_distribution_category_idx` ON `wiki_articles` (`distributionId`,`category`);--> statement-breakpoint
CREATE INDEX `wiki_articles_status_idx` ON `wiki_articles` (`status`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `users_banned_idx` ON `users` (`isBanned`);