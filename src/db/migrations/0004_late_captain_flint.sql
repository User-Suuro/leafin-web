CREATE TABLE `sensor_data` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`connected` boolean NOT NULL,
	`time` varchar(50) NOT NULL,
	`date` varchar(50) NOT NULL,
	`ph` varchar(50) NOT NULL,
	`turbid` varchar(50) NOT NULL,
	`water_temp` varchar(50) NOT NULL,
	`tds` varchar(50) NOT NULL,
	`is_water_lvl_normal` varchar(50) NOT NULL,
	`nh3_gas` varchar(50) NOT NULL,
	`fraction_nh3` varchar(50) NOT NULL,
	`total_ammonia` varchar(50) NOT NULL,
	`web_time` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensor_data_id` PRIMARY KEY(`id`)
);
