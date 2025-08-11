CREATE TABLE `fish_batch` (
	`fish_batch_id` serial AUTO_INCREMENT NOT NULL,
	`fish_quantity` int NOT NULL,
	`fish_days` int DEFAULT 0,
	`date_added` datetime NOT NULL,
	`conditions` varchar(50),
	CONSTRAINT `fish_batch_fish_batch_id` PRIMARY KEY(`fish_batch_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_batch` (
	`plant_batch_id` serial AUTO_INCREMENT NOT NULL,
	`plant_quantity` int NOT NULL,
	`plant_days` int DEFAULT 0,
	`date_added` datetime NOT NULL,
	`conditions` varchar(50),
	CONSTRAINT `plant_batch_plant_batch_id` PRIMARY KEY(`plant_batch_id`)
);
