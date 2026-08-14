ALTER TABLE `linux_fix_solutions` ADD `kind` enum('inspect','change','verify','recover') DEFAULT 'inspect' NOT NULL;--> statement-breakpoint
ALTER TABLE `linux_fix_solutions` ADD `risk` enum('read_only','reversible','system_change') DEFAULT 'read_only' NOT NULL;--> statement-breakpoint
ALTER TABLE `linux_fix_solutions` ADD `verification` text;--> statement-breakpoint
ALTER TABLE `linux_fix_solutions` ADD `rollback` text;--> statement-breakpoint
ALTER TABLE `linux_fix_solutions` ADD `sourceUrl` varchar(2048);