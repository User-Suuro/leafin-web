ALTER TABLE `sensor_data` MODIFY COLUMN `is_water_lvl_normal` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `sensor_data` DROP COLUMN `web_time`;