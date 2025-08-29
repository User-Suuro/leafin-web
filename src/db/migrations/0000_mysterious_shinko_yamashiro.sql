CREATE TABLE `fish_batch` (
	`fish_batch_id` int AUTO_INCREMENT NOT NULL,
	`fish_quantity` int NOT NULL,
	`fish_days` int DEFAULT 0,
	`date_added` datetime NOT NULL,
	`conditions` varchar(50),
	`expected_harvest_date` date,
	`batch_status` enum('growing','ready','harvested','discarded') DEFAULT 'growing',
	CONSTRAINT `fish_batch_fish_batch_id` PRIMARY KEY(`fish_batch_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_batch` (
	`plant_batch_id` int AUTO_INCREMENT NOT NULL,
	`plant_quantity` int NOT NULL,
	`plant_days` int DEFAULT 0,
	`date_added` datetime NOT NULL,
	`conditions` varchar(50),
	`expected_harvest_date` date,
	`batch_status` enum('growing','ready','harvested','discarded') DEFAULT 'growing',
	CONSTRAINT `plant_batch_plant_batch_id` PRIMARY KEY(`plant_batch_id`)
);
--> statement-breakpoint
CREATE TABLE `sensor_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`time` varchar(100) NOT NULL,
	`date` varchar(100) NOT NULL,
	`ph` varchar(100) NOT NULL,
	`turbid` varchar(100) NOT NULL,
	`water_temp` varchar(100) NOT NULL,
	`tds` varchar(100) NOT NULL,
	`is_water_lvl_normal` boolean NOT NULL,
	`nh3_gas` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensor_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`task_id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`task_type` enum('feeding','maintenance','cleaning','harvest','planting','other') NOT NULL,
	`scheduled_date` date,
	`scheduled_time` time,
	`status` enum('pending','in_progress','completed') DEFAULT 'pending',
	`related_fish_batch_id` int,
	`related_plant_batch_id` int,
	CONSTRAINT `tasks_task_id` PRIMARY KEY(`task_id`)
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_fish_batch_fk` FOREIGN KEY (`related_fish_batch_id`) REFERENCES `fish_batch`(`fish_batch_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_plant_batch_fk` FOREIGN KEY (`related_plant_batch_id`) REFERENCES `plant_batch`(`plant_batch_id`) ON DELETE no action ON UPDATE no action;