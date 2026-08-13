ALTER TABLE `games` ADD `sourcePositiveReviews` int;--> statement-breakpoint
CREATE INDEX `games_catalog_popularity_idx` ON `games` (`status`,`sourcePositiveReviews`);