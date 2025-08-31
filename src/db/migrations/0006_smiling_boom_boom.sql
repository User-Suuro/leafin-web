CREATE TABLE `logs` (
	`log_id` int AUTO_INCREMENT NOT NULL,
	`event_time` datetime DEFAULT CURRENT_TIMESTAMP,
	`notes` text,
	`task_id` int,
	`related_fish_sale_id` int,
	`related_plant_sale_id` int,
	`related_expense_id` int,
	CONSTRAINT `logs_log_id` PRIMARY KEY(`log_id`)
);
