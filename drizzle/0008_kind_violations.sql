ALTER TABLE `content_sources` ADD `scheduleCronTaskUid` varchar(65);--> statement-breakpoint
CREATE INDEX `content_sources_cron_uid_idx` ON `content_sources` (`scheduleCronTaskUid`);