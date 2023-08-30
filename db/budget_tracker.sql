/*
Navicat MySQL Data Transfer

Source Server         : newuser12222
Source Server Version : 80032
Source Host           : localhost:3306
Source Database       : budget_tracker

Target Server Type    : MYSQL
Target Server Version : 80032
File Encoding         : 65001

Date: 2023-08-25 18:45:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for budget_status
-- ----------------------------
DROP TABLE IF EXISTS `budget_status`;
CREATE TABLE `budget_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `year_month` date NOT NULL,
  `status` enum('expected','waiting','ongoing','closed') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_month` (`user_id`,`year_month`)
) ENGINE=InnoDB AUTO_INCREMENT=459 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of budget_status
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES ('1', 'Other', '2023-08-15 11:25:38', '2023-08-17 13:28:24');
INSERT INTO `categories` VALUES ('22', 'Housing', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('23', 'Utilities', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('24', 'Transportation', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('25', 'Healthcare', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('26', 'Education', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('27', 'Personal Care', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('28', 'Clothing & Shoes', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('29', 'Entertainment & Hobbies', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('30', 'Food & Dining', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('31', 'Pets', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('32', 'Gifts & Celebrations', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('33', 'Savings', '2023-08-15 11:25:38', '2023-08-15 11:25:38');
INSERT INTO `categories` VALUES ('34', 'Debt', '2023-08-15 11:25:38', '2023-08-15 11:25:38');

-- ----------------------------
-- Table structure for chatgpt_queries
-- ----------------------------
DROP TABLE IF EXISTS `chatgpt_queries`;
CREATE TABLE `chatgpt_queries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` char(36) DEFAULT NULL,
  `query` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `response` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `prompt_tokens` int DEFAULT NULL,
  `completion_tokens` int DEFAULT NULL,
  `total_tokens` int DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of chatgpt_queries
-- ----------------------------

-- ----------------------------
-- Table structure for expenses
-- ----------------------------
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) DEFAULT NULL,
  `category_id` int NOT NULL,
  `expense_name` varchar(100) NOT NULL,
  `expense_amount` decimal(10,2) NOT NULL,
  `expense_type` enum('Fixed','Variable') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expense_month` date DEFAULT NULL,
  `used_already` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `expenses_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=827 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of expenses
-- ----------------------------

-- ----------------------------
-- Table structure for subcategories
-- ----------------------------
DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `sub_category_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of subcategories
-- ----------------------------

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) DEFAULT NULL,
  `transaction_name` varchar(100) NOT NULL,
  `transaction_amount` decimal(10,2) NOT NULL,
  `transaction_date` date NOT NULL,
  `matched_expense_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of transactions
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `password` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('025dcbc2-88e5-4125-9f87-07b20527b285', 'mariokhan', '222', '2023-08-24 20:33:50', '2023-08-24 20:33:50', '$2b$10$.BFIA6IV9tzCL9zHuLFdvOj3V6HKo9hYVLocmhlTxlFXYY6X2rM3K', null);

-- ----------------------------
-- Table structure for user_preferences
-- ----------------------------
DROP TABLE IF EXISTS `user_preferences`;
CREATE TABLE `user_preferences` (
  `user_id` char(36) NOT NULL,
  `language` varchar(255) DEFAULT NULL,
  `locale` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `dateFormat` varchar(255) DEFAULT NULL,
  `moneyFormat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_preferences
-- ----------------------------
INSERT INTO `user_preferences` VALUES ('025dcbc2-88e5-4125-9f87-07b20527b285', 'zh', 'en-US', 'JPY', 'MM-DD-YYYY', '1,234.56');
