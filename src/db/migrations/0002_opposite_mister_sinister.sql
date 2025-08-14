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
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_related_fish_batch_id_fish_batch_fish_batch_id_fk` FOREIGN KEY (`related_fish_batch_id`) REFERENCES `fish_batch`(`fish_batch_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_related_plant_batch_id_plant_batch_plant_batch_id_fk` FOREIGN KEY (`related_plant_batch_id`) REFERENCES `plant_batch`(`plant_batch_id`) ON DELETE no action ON UPDATE no action;