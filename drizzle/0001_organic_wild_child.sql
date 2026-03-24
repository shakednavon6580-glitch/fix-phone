CREATE TABLE `b2bLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(50) NOT NULL,
	`companySize` enum('1-10','11-50','51-100','100+') NOT NULL,
	`servicesInterested` text NOT NULL,
	`message` text,
	`status` enum('new','contacted','qualified','proposal_sent','won','lost') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `b2bLeads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`imageUrl` varchar(500),
	`metaTitle` varchar(255),
	`metaDescription` text,
	`metaKeywords` text,
	`isPublished` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`authorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `chatConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(100) NOT NULL,
	`messages` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatConversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `chatConversations_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameHebrew` varchar(255) NOT NULL,
	`description` text,
	`descriptionHebrew` text,
	`category` varchar(100) NOT NULL,
	`categoryHebrew` varchar(100) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`discountPrice` decimal(10,2),
	`stockQuantity` int NOT NULL DEFAULT 0,
	`lowStockThreshold` int NOT NULL DEFAULT 5,
	`imageUrl` varchar(500),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repairs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseNumber` varchar(50) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerPhone` varchar(50) NOT NULL,
	`customerEmail` varchar(320),
	`deviceType` varchar(100) NOT NULL,
	`deviceModel` varchar(100),
	`issueDescription` text NOT NULL,
	`status` enum('awaiting_service','in_progress','awaiting_parts','completed','delivered','canceled') NOT NULL DEFAULT 'awaiting_service',
	`estimatedPrice` decimal(10,2),
	`finalPrice` decimal(10,2),
	`technicianNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `repairs_id` PRIMARY KEY(`id`),
	CONSTRAINT `repairs_caseNumber_unique` UNIQUE(`caseNumber`)
);
--> statement-breakpoint
ALTER TABLE `blogPosts` ADD CONSTRAINT `blogPosts_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;