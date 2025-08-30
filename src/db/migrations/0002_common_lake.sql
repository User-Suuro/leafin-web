ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_fish_batch_fk`;
--> statement-breakpoint
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_plant_batch_fk`;
--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_related_fish_batch_id_fish_batch_fish_batch_id_fk` FOREIGN KEY (`related_fish_batch_id`) REFERENCES `fish_batch`(`fish_batch_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_related_plant_batch_id_plant_batch_plant_batch_id_fk` FOREIGN KEY (`related_plant_batch_id`) REFERENCES `plant_batch`(`plant_batch_id`) ON DELETE no action ON UPDATE no action;