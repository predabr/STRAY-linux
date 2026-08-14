ALTER TABLE `content_sources` ADD `catalogCursorAppId` int;--> statement-breakpoint
ALTER TABLE `content_sources` ADD `lastCatalogRefreshAt` timestamp;--> statement-breakpoint
CREATE INDEX `content_sources_catalog_refresh_idx` ON `content_sources` (`lastCatalogRefreshAt`);