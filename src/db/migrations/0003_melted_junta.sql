ALTER TABLE `plant_batch` ADD `expected_harvest_date` date;--> statement-breakpoint
ALTER TABLE `plant_batch` ADD `batch_status` enum('growing','ready','harvested','discarded') DEFAULT 'growing';