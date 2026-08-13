ALTER TABLE `user_hardware_profiles` ADD `detectedCpu` varchar(255);--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `detectedGpu` varchar(255);--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `detectedRamGb` int;--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `detectedDistribution` varchar(255);--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `scannerVersion` varchar(80);--> statement-breakpoint
ALTER TABLE `user_hardware_profiles` ADD `scannedAt` timestamp;