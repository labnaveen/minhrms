-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: minhrms_staging
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `minhrms_staging`
--


--
-- Table structure for table `accrual_frequency`
--

DROP TABLE IF EXISTS `accrual_frequency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accrual_frequency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accrual_frequency`
--

LOCK TABLES `accrual_frequency` WRITE;
/*!40000 ALTER TABLE `accrual_frequency` DISABLE KEYS */;
INSERT INTO `accrual_frequency` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Monthly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Quaterly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Half-yearly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'Yearly','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `accrual_frequency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accrual_from`
--

DROP TABLE IF EXISTS `accrual_from`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accrual_from` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accrual_from`
--

LOCK TABLES `accrual_from` WRITE;
/*!40000 ALTER TABLE `accrual_from` DISABLE KEYS */;
INSERT INTO `accrual_from` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Date of Joining','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Date of Confirmation','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Custom date for Accural','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `accrual_from` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accrual_type`
--

DROP TABLE IF EXISTS `accrual_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accrual_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accrual_type`
--

LOCK TABLES `accrual_type` WRITE;
/*!40000 ALTER TABLE `accrual_type` DISABLE KEYS */;
INSERT INTO `accrual_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Beginning Of Cycle','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'End Of Cycle','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `accrual_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `suspendable` tinyint(1) NOT NULL DEFAULT '0',
  `group_specific` tinyint(1) NOT NULL DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement_division_unit`
--

DROP TABLE IF EXISTS `announcement_division_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_division_unit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `announcement_id` int NOT NULL,
  `division_unit_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `announcement_id` (`announcement_id`),
  KEY `division_unit_id` (`division_unit_id`),
  CONSTRAINT `announcement_division_unit_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcement` (`id`),
  CONSTRAINT `announcement_division_unit_ibfk_2` FOREIGN KEY (`division_unit_id`) REFERENCES `division_units` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_division_unit`
--

LOCK TABLES `announcement_division_unit` WRITE;
/*!40000 ALTER TABLE `announcement_division_unit` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement_division_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement_employee`
--

DROP TABLE IF EXISTS `announcement_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `announcement_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `announcement_id` (`announcement_id`),
  KEY `employee_id` (`user_id`),
  CONSTRAINT `announcement_employee_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcement` (`id`),
  CONSTRAINT `announcement_employee_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_employee`
--

LOCK TABLES `announcement_employee` WRITE;
/*!40000 ALTER TABLE `announcement_employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement_employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_flow`
--

DROP TABLE IF EXISTS `approval_flow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_flow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `approval_flow_type_id` int DEFAULT NULL,
  `confirm_by_both_direct_undirect` tinyint(1) DEFAULT '0',
  `confirmation_by_all` tinyint(1) DEFAULT '0',
  `confirmation_by_all_direct` tinyint(1) DEFAULT '0',
  `confirmation_by_all_indirect` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `approval_flow_type_id` (`approval_flow_type_id`),
  CONSTRAINT `approval_flow_ibfk_1` FOREIGN KEY (`approval_flow_type_id`) REFERENCES `approval_flow_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_flow`
--

LOCK TABLES `approval_flow` WRITE;
/*!40000 ALTER TABLE `approval_flow` DISABLE KEYS */;
INSERT INTO `approval_flow` (`id`, `name`, `description`, `approval_flow_type_id`, `confirm_by_both_direct_undirect`, `confirmation_by_all`, `confirmation_by_all_direct`, `confirmation_by_all_indirect`, `created_at`, `updated_at`) VALUES (1,'Standard Approval Flow','Testing default flow',1,0,0,0,0,'2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `approval_flow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_flow_reporting_role`
--

DROP TABLE IF EXISTS `approval_flow_reporting_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_flow_reporting_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `approval_flow_id` int DEFAULT NULL,
  `reporting_role_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `approval_flow_id` (`approval_flow_id`),
  KEY `reporting_role_id` (`reporting_role_id`),
  CONSTRAINT `approval_flow_reporting_role_ibfk_3` FOREIGN KEY (`approval_flow_id`) REFERENCES `approval_flow` (`id`),
  CONSTRAINT `approval_flow_reporting_role_ibfk_4` FOREIGN KEY (`reporting_role_id`) REFERENCES `reporting_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_flow_reporting_role`
--

LOCK TABLES `approval_flow_reporting_role` WRITE;
/*!40000 ALTER TABLE `approval_flow_reporting_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_flow_reporting_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_flow_supervisor_indirect`
--

DROP TABLE IF EXISTS `approval_flow_supervisor_indirect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_flow_supervisor_indirect` (
  `id` int NOT NULL AUTO_INCREMENT,
  `approval_flow_id` int DEFAULT NULL,
  `supervisor_role_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `approval_flow_id` (`approval_flow_id`),
  KEY `reporting_role_id` (`supervisor_role_id`),
  CONSTRAINT `approval_flow_supervisor_indirect_ibfk_3` FOREIGN KEY (`approval_flow_id`) REFERENCES `approval_flow` (`id`),
  CONSTRAINT `approval_flow_supervisor_indirect_ibfk_4` FOREIGN KEY (`supervisor_role_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_flow_supervisor_indirect`
--

LOCK TABLES `approval_flow_supervisor_indirect` WRITE;
/*!40000 ALTER TABLE `approval_flow_supervisor_indirect` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_flow_supervisor_indirect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_flow_type`
--

DROP TABLE IF EXISTS `approval_flow_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_flow_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_flow_type`
--

LOCK TABLES `approval_flow_type` WRITE;
/*!40000 ALTER TABLE `approval_flow_type` DISABLE KEYS */;
INSERT INTO `approval_flow_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Parallel','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Sequential','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `approval_flow_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_status`
--

DROP TABLE IF EXISTS `approval_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_status`
--

LOCK TABLES `approval_status` WRITE;
/*!40000 ALTER TABLE `approval_status` DISABLE KEYS */;
INSERT INTO `approval_status` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Pending','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Approve','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Reject','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `approval_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_code` varchar(255) NOT NULL,
  `asset_name` varchar(255) NOT NULL,
  `date_of_purchase` datetime NOT NULL,
  `asset_cost` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_assigned` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assigned_asset`
--

DROP TABLE IF EXISTS `assigned_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_asset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `asset_id` int NOT NULL,
  `date_of_issue` date NOT NULL,
  `date_of_return` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `assigned_asset_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `assigned_asset_ibfk_2` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_asset`
--

LOCK TABLES `assigned_asset` WRITE;
/*!40000 ALTER TABLE `assigned_asset` DISABLE KEYS */;
/*!40000 ALTER TABLE `assigned_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `employee_generated_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `punch_in_time` datetime DEFAULT NULL,
  `punch_out_time` datetime DEFAULT NULL,
  `status` int NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `flexi_used` tinyint(1) NOT NULL DEFAULT '0',
  `grace_used` tinyint(1) NOT NULL DEFAULT '0',
  `flexi_counter` int DEFAULT '0',
  `grace_counter` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1421 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` (`id`, `user_id`, `employee_generated_id`, `date`, `punch_in_time`, `punch_out_time`, `status`, `is_deleted`, `created_at`, `updated_at`, `flexi_used`, `grace_used`, `flexi_counter`, `grace_counter`) VALUES (1,1,'GV-01','2024-08-28',NULL,NULL,1,0,'2024-08-28 05:30:00','2024-08-28 05:30:00',0,0,0,0),(2,2,'GV-02','2024-08-28',NULL,NULL,1,0,'2024-08-28 05:30:00','2024-08-28 05:30:00',0,0,0,0),(3,3,'GV-03','2024-08-28',NULL,NULL,1,0,'2024-08-28 05:30:00','2024-08-28 05:30:00',0,0,0,0),(4,4,'GV-04','2024-08-28',NULL,NULL,1,0,'2024-08-28 05:30:00','2024-08-28 05:30:00',0,0,0,0),(5,5,'GV-05','2024-08-28',NULL,NULL,1,0,'2024-08-28 05:30:00','2024-08-28 05:30:00',0,0,0,0),(6,1,'GV-01','2024-08-29',NULL,NULL,1,0,'2024-08-29 05:30:00','2024-08-29 05:30:00',0,0,0,0),(7,2,'GV-02','2024-08-29',NULL,NULL,1,0,'2024-08-29 05:30:00','2024-08-29 05:30:00',0,0,0,0),(8,3,'GV-03','2024-08-29',NULL,NULL,1,0,'2024-08-29 05:30:00','2024-08-29 05:30:00',0,0,0,0),(9,4,'GV-04','2024-08-29',NULL,NULL,1,0,'2024-08-29 05:30:00','2024-08-29 05:30:00',0,0,0,0),(10,5,'GV-05','2024-08-29',NULL,NULL,1,0,'2024-08-29 05:30:00','2024-08-29 05:30:00',0,0,0,0),(11,1,'GV-01','2024-08-30',NULL,NULL,1,0,'2024-08-30 05:30:00','2024-08-30 05:30:00',0,0,0,0),(12,2,'GV-02','2024-08-30',NULL,NULL,1,0,'2024-08-30 05:30:00','2024-08-30 05:30:00',0,0,0,0),(13,3,'GV-03','2024-08-30',NULL,NULL,1,0,'2024-08-30 05:30:00','2024-08-30 05:30:00',0,0,0,0),(14,4,'GV-04','2024-08-30',NULL,NULL,1,0,'2024-08-30 05:30:00','2024-08-30 05:30:00',0,0,0,0),(15,5,'GV-05','2024-08-30',NULL,NULL,1,0,'2024-08-30 05:30:00','2024-08-30 05:30:00',0,0,0,0),(16,1,'GV-01','2024-08-31',NULL,NULL,1,0,'2024-08-31 05:30:00','2024-08-31 05:30:00',0,0,0,0),(17,2,'GV-02','2024-08-31',NULL,NULL,1,0,'2024-08-31 05:30:00','2024-08-31 05:30:00',0,0,0,0),(18,3,'GV-03','2024-08-31',NULL,NULL,1,0,'2024-08-31 05:30:00','2024-08-31 05:30:00',0,0,0,0),(19,4,'GV-04','2024-08-31',NULL,NULL,1,0,'2024-08-31 05:30:00','2024-08-31 05:30:00',0,0,0,0),(20,5,'GV-05','2024-08-31',NULL,NULL,1,0,'2024-08-31 05:30:00','2024-08-31 05:30:00',0,0,0,0),(21,1,'GV-01','2024-09-01',NULL,NULL,1,0,'2024-09-01 05:30:00','2024-09-01 05:30:00',0,0,0,0),(22,2,'GV-02','2024-09-01',NULL,NULL,1,0,'2024-09-01 05:30:00','2024-09-01 05:30:00',0,0,0,0),(23,3,'GV-03','2024-09-01',NULL,NULL,1,0,'2024-09-01 05:30:00','2024-09-01 05:30:00',0,0,0,0),(24,4,'GV-04','2024-09-01',NULL,NULL,1,0,'2024-09-01 05:30:00','2024-09-01 05:30:00',0,0,0,0),(25,5,'GV-05','2024-09-01',NULL,NULL,1,0,'2024-09-01 05:30:00','2024-09-01 05:30:00',0,0,0,0),(26,1,'GV-01','2024-09-02',NULL,NULL,1,0,'2024-09-02 05:30:00','2024-09-02 05:30:00',0,0,0,0),(27,2,'GV-02','2024-09-02',NULL,NULL,1,0,'2024-09-02 05:30:00','2024-09-02 05:30:00',0,0,0,0),(28,3,'GV-03','2024-09-02',NULL,NULL,1,0,'2024-09-02 05:30:00','2024-09-02 05:30:00',0,0,0,0),(29,4,'GV-04','2024-09-02',NULL,NULL,1,0,'2024-09-02 05:30:00','2024-09-02 05:30:00',0,0,0,0),(30,5,'GV-05','2024-09-02',NULL,NULL,1,0,'2024-09-02 05:30:00','2024-09-02 05:30:01',0,0,0,0),(31,1,'GV-01','2024-09-03',NULL,NULL,1,0,'2024-09-03 05:30:00','2024-09-03 05:30:00',0,0,0,0),(32,2,'GV-02','2024-09-03',NULL,NULL,1,0,'2024-09-03 05:30:00','2024-09-03 05:30:00',0,0,0,0),(33,3,'GV-03','2024-09-03',NULL,NULL,1,0,'2024-09-03 05:30:00','2024-09-03 05:30:00',0,0,0,0),(34,4,'GV-04','2024-09-03',NULL,NULL,1,0,'2024-09-03 05:30:00','2024-09-03 05:30:00',0,0,0,0),(35,5,'GV-05','2024-09-03',NULL,NULL,1,0,'2024-09-03 05:30:00','2024-09-03 05:30:00',0,0,0,0),(36,1,'GV-01','2024-09-04',NULL,NULL,1,0,'2024-09-04 05:30:00','2024-09-04 05:30:00',0,0,0,0),(37,2,'GV-02','2024-09-04',NULL,NULL,1,0,'2024-09-04 05:30:00','2024-09-04 05:30:00',0,0,0,0),(38,3,'GV-03','2024-09-04',NULL,NULL,1,0,'2024-09-04 05:30:00','2024-09-04 05:30:00',0,0,0,0),(39,4,'GV-04','2024-09-04',NULL,NULL,1,0,'2024-09-04 05:30:00','2024-09-04 05:30:00',0,0,0,0),(40,5,'GV-05','2024-09-04',NULL,NULL,1,0,'2024-09-04 05:30:00','2024-09-04 05:30:00',0,0,0,0),(41,1,'GV-01','2024-09-05',NULL,NULL,1,0,'2024-09-05 05:30:00','2024-09-05 05:30:00',0,0,0,0),(42,2,'GV-02','2024-09-05',NULL,NULL,1,0,'2024-09-05 05:30:00','2024-09-05 05:30:00',0,0,0,0),(43,3,'GV-03','2024-09-05',NULL,NULL,1,0,'2024-09-05 05:30:00','2024-09-05 05:30:00',0,0,0,0),(44,4,'GV-04','2024-09-05',NULL,NULL,1,0,'2024-09-05 05:30:00','2024-09-05 05:30:00',0,0,0,0),(45,5,'GV-05','2024-09-05',NULL,NULL,1,0,'2024-09-05 05:30:00','2024-09-05 05:30:00',0,0,0,0),(46,1,'GV-01','2024-09-06',NULL,NULL,1,0,'2024-09-06 05:30:00','2024-09-06 05:30:00',0,0,0,0),(47,2,'GV-02','2024-09-06',NULL,NULL,1,0,'2024-09-06 05:30:00','2024-09-06 05:30:00',0,0,0,0),(48,3,'GV-03','2024-09-06',NULL,NULL,1,0,'2024-09-06 05:30:00','2024-09-06 05:30:00',0,0,0,0),(49,4,'GV-04','2024-09-06',NULL,NULL,1,0,'2024-09-06 05:30:00','2024-09-06 05:30:00',0,0,0,0),(50,5,'GV-05','2024-09-06',NULL,NULL,1,0,'2024-09-06 05:30:00','2024-09-06 05:30:00',0,0,0,0),(51,1,'GV-01','2024-09-07',NULL,NULL,1,0,'2024-09-07 05:30:00','2024-09-07 05:30:00',0,0,0,0),(52,2,'GV-02','2024-09-07',NULL,NULL,1,0,'2024-09-07 05:30:00','2024-09-07 05:30:00',0,0,0,0),(53,3,'GV-03','2024-09-07',NULL,NULL,1,0,'2024-09-07 05:30:00','2024-09-07 05:30:00',0,0,0,0),(54,4,'GV-04','2024-09-07',NULL,NULL,1,0,'2024-09-07 05:30:00','2024-09-07 05:30:00',0,0,0,0),(55,5,'GV-05','2024-09-07',NULL,NULL,1,0,'2024-09-07 05:30:00','2024-09-07 05:30:00',0,0,0,0),(56,1,'GV-01','2024-09-08',NULL,NULL,1,0,'2024-09-08 05:30:00','2024-09-08 05:30:00',0,0,0,0),(57,2,'GV-02','2024-09-08',NULL,NULL,1,0,'2024-09-08 05:30:00','2024-09-08 05:30:00',0,0,0,0),(58,3,'GV-03','2024-09-08',NULL,NULL,1,0,'2024-09-08 05:30:00','2024-09-08 05:30:00',0,0,0,0),(59,4,'GV-04','2024-09-08',NULL,NULL,1,0,'2024-09-08 05:30:00','2024-09-08 05:30:00',0,0,0,0),(60,5,'GV-05','2024-09-08',NULL,NULL,1,0,'2024-09-08 05:30:00','2024-09-08 05:30:01',0,0,0,0),(61,1,'GV-01','2024-09-09',NULL,NULL,1,0,'2024-09-09 05:30:00','2024-09-09 05:30:00',0,0,0,0),(62,2,'GV-02','2024-09-09',NULL,NULL,1,0,'2024-09-09 05:30:00','2024-09-09 05:30:00',0,0,0,0),(63,3,'GV-03','2024-09-09',NULL,NULL,1,0,'2024-09-09 05:30:00','2024-09-09 05:30:00',0,0,0,0),(64,4,'GV-04','2024-09-09',NULL,NULL,1,0,'2024-09-09 05:30:00','2024-09-09 05:30:01',0,0,0,0),(65,5,'GV-05','2024-09-09',NULL,NULL,1,0,'2024-09-09 05:30:00','2024-09-09 05:30:01',0,0,0,0),(66,1,'GV-01','2024-09-10',NULL,NULL,1,0,'2024-09-10 05:30:00','2024-09-10 05:30:00',0,0,0,0),(67,2,'GV-02','2024-09-10',NULL,NULL,1,0,'2024-09-10 05:30:00','2024-09-10 05:30:00',0,0,0,0),(68,3,'GV-03','2024-09-10',NULL,NULL,1,0,'2024-09-10 05:30:00','2024-09-10 05:30:00',0,0,0,0),(69,4,'GV-04','2024-09-10',NULL,NULL,1,0,'2024-09-10 05:30:00','2024-09-10 05:30:00',0,0,0,0),(70,5,'GV-05','2024-09-10',NULL,NULL,1,0,'2024-09-10 05:30:00','2024-09-10 05:30:00',0,0,0,0),(71,1,'GV-01','2024-09-11',NULL,NULL,1,0,'2024-09-11 05:30:00','2024-09-11 05:30:00',0,0,0,0),(72,2,'GV-02','2024-09-11',NULL,NULL,1,0,'2024-09-11 05:30:00','2024-09-11 05:30:00',0,0,0,0),(73,3,'GV-03','2024-09-11',NULL,NULL,1,0,'2024-09-11 05:30:00','2024-09-11 05:30:00',0,0,0,0),(74,4,'GV-04','2024-09-11',NULL,NULL,1,0,'2024-09-11 05:30:00','2024-09-11 05:30:00',0,0,0,0),(75,5,'GV-05','2024-09-11',NULL,NULL,1,0,'2024-09-11 05:30:00','2024-09-11 05:30:00',0,0,0,0),(76,1,'GV-01','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(77,2,'GV-02','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(78,3,'GV-03','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(79,4,'GV-04','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(80,5,'GV-05','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(81,6,'GLI0132','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(82,7,'GV-06','2024-09-12',NULL,NULL,1,0,'2024-09-12 05:30:00','2024-09-12 05:30:00',0,0,0,0),(83,1,'GV-01','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(84,2,'GV-02','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(85,3,'GV-03','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(86,4,'GV-04','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(87,5,'GV-05','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(88,6,'GLI0132','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(89,7,'GV-06','2024-09-13',NULL,NULL,1,0,'2024-09-13 05:30:00','2024-09-13 05:30:00',0,0,0,0),(90,1,'GV-01','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(91,2,'GV-02','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(92,3,'GV-03','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(93,4,'GV-04','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(94,5,'GV-05','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(95,6,'GLI0132','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(96,7,'GV-06','2024-09-14',NULL,NULL,1,0,'2024-09-14 05:30:00','2024-09-14 05:30:00',0,0,0,0),(97,1,'GV-01','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:00',0,0,0,0),(98,2,'GV-02','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:00',0,0,0,0),(99,3,'GV-03','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:00',0,0,0,0),(100,4,'GV-04','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:00',0,0,0,0),(101,5,'GV-05','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:00',0,0,0,0),(102,6,'GLI0132','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:01',0,0,0,0),(103,7,'GV-06','2024-09-15',NULL,NULL,1,0,'2024-09-15 05:30:00','2024-09-15 05:30:01',0,0,0,0),(104,1,'GV-01','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(105,2,'GV-02','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(106,3,'GV-03','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(107,4,'GV-04','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(108,5,'GV-05','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(109,6,'GLI0132','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(110,7,'GV-06','2024-09-16',NULL,NULL,1,0,'2024-09-16 05:30:00','2024-09-16 05:30:00',0,0,0,0),(111,1,'GV-01','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(112,2,'GV-02','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(113,3,'GV-03','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(114,4,'GV-04','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(115,5,'GV-05','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(116,6,'GLI0132','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(117,7,'GV-06','2024-09-17',NULL,NULL,1,0,'2024-09-17 05:30:00','2024-09-17 05:30:00',0,0,0,0),(118,1,'GV-01','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(119,2,'GV-02','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(120,3,'GV-03','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(121,4,'GV-04','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(122,5,'GV-05','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(123,6,'GLI0132','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(124,7,'GV-06','2024-09-18',NULL,NULL,1,0,'2024-09-18 05:30:00','2024-09-18 05:30:00',0,0,0,0),(125,1,'GV-01','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(126,2,'GV-02','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(127,3,'GV-03','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(128,4,'GV-04','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(129,5,'GV-05','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(130,6,'GLI0132','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(131,7,'GV-06','2024-09-19',NULL,NULL,1,0,'2024-09-19 05:30:00','2024-09-19 05:30:00',0,0,0,0),(132,1,'GV-01','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(133,2,'GV-02','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(134,3,'GV-03','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(135,4,'GV-04','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(136,5,'GV-05','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(137,6,'GLI0132','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(138,7,'GV-06','2024-09-21',NULL,NULL,1,0,'2024-09-21 05:30:00','2024-09-21 05:30:00',0,0,0,0),(139,1,'GV-01','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(140,2,'GV-02','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(141,3,'GV-03','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(142,4,'GV-04','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(143,5,'GV-05','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(144,6,'GLI0132','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(145,7,'GV-06','2024-09-22',NULL,NULL,1,0,'2024-09-22 05:30:00','2024-09-22 05:30:00',0,0,0,0),(146,1,'GV-01','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(147,2,'GV-02','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(148,3,'GV-03','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(149,4,'GV-04','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(150,5,'GV-05','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(151,6,'GLI0132','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(152,7,'GV-06','2024-09-23',NULL,NULL,1,0,'2024-09-23 05:30:00','2024-09-23 05:30:00',0,0,0,0),(153,1,'GV-01','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(154,2,'GV-02','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(155,3,'GV-03','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(156,4,'GV-04','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(157,5,'GV-05','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(158,6,'GLI0132','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(159,7,'GV-06','2024-09-24',NULL,NULL,1,0,'2024-09-24 05:30:00','2024-09-24 05:30:00',0,0,0,0),(160,1,'GV-01','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(161,2,'GV-02','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(162,3,'GV-03','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(163,4,'GV-04','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(164,5,'GV-05','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(165,6,'GLI0132','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(166,7,'GV-06','2024-09-25',NULL,NULL,1,0,'2024-09-25 05:30:00','2024-09-25 05:30:00',0,0,0,0),(167,1,'GV-01','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(168,2,'GV-02','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(169,3,'GV-03','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(170,4,'GV-04','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(171,5,'GV-05','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(172,6,'GLI0132','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(173,7,'GV-06','2024-09-26',NULL,NULL,1,0,'2024-09-26 05:30:00','2024-09-26 05:30:00',0,0,0,0),(174,1,'GV-01','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(175,2,'GV-02','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(176,3,'GV-03','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(177,4,'GV-04','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(178,5,'GV-05','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(179,6,'GLI0132','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(180,7,'GV-06','2024-09-27',NULL,NULL,1,0,'2024-09-27 05:30:00','2024-09-27 05:30:00',0,0,0,0),(181,1,'GV-01','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(182,2,'GV-02','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(183,3,'GV-03','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(184,4,'GV-04','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(185,5,'GV-05','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(186,6,'GLI0132','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(187,7,'GV-06','2024-09-28',NULL,NULL,1,0,'2024-09-28 05:30:00','2024-09-28 05:30:00',0,0,0,0),(188,1,'GV-01','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(189,2,'GV-02','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(190,3,'GV-03','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(191,4,'GV-04','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(192,5,'GV-05','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(193,6,'GLI0132','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(194,7,'GV-06','2024-09-29',NULL,NULL,1,0,'2024-09-29 05:30:00','2024-09-29 05:30:00',0,0,0,0),(195,1,'GV-01','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(196,2,'GV-02','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(197,3,'GV-03','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(198,4,'GV-04','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(199,5,'GV-05','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(200,6,'GLI0132','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(201,7,'GV-06','2024-09-30',NULL,NULL,1,0,'2024-09-30 05:30:00','2024-09-30 05:30:00',0,0,0,0),(202,1,'GV-01','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(203,2,'GV-02','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(204,3,'GV-03','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(205,4,'GV-04','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(206,5,'GV-05','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(207,6,'GLI0132','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(208,7,'GV-06','2024-10-01',NULL,NULL,1,0,'2024-10-01 05:30:00','2024-10-01 05:30:00',0,0,0,0),(209,1,'GV-01','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(210,2,'GV-02','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(211,3,'GV-03','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(212,4,'GV-04','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(213,5,'GV-05','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(214,6,'GLI0132','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(215,7,'GV-06','2024-10-02',NULL,NULL,1,0,'2024-10-02 05:30:00','2024-10-02 05:30:00',0,0,0,0),(216,1,'GV-01','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(217,2,'GV-02','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(218,3,'GV-03','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(219,4,'GV-04','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(220,5,'GV-05','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(221,6,'GLI0132','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(222,7,'GV-06','2024-10-03',NULL,NULL,1,0,'2024-10-03 05:30:00','2024-10-03 05:30:00',0,0,0,0),(223,1,'GV-01','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(224,2,'GV-02','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(225,3,'GV-03','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(226,4,'GV-04','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(227,5,'GV-05','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(228,6,'GLI0132','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(229,7,'GV-06','2024-10-04',NULL,NULL,1,0,'2024-10-04 05:30:00','2024-10-04 05:30:00',0,0,0,0),(230,1,'GV-01','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(231,2,'GV-02','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(232,3,'GV-03','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(233,4,'GV-04','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(234,5,'GV-05','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(235,6,'GLI0132','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(236,7,'GV-06','2024-10-05',NULL,NULL,1,0,'2024-10-05 05:30:00','2024-10-05 05:30:00',0,0,0,0),(237,1,'GV-01','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(238,2,'GV-02','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(239,3,'GV-03','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(240,4,'GV-04','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(241,5,'GV-05','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(242,6,'GLI0132','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(243,7,'GV-06','2024-10-16',NULL,NULL,1,0,'2024-10-16 05:30:01','2024-10-16 05:30:01',0,0,0,0),(244,1,'GV-01','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(245,2,'GV-02','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(246,3,'GV-03','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(247,4,'GV-04','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(248,5,'GV-05','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(249,6,'GLI0132','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(250,7,'GV-06','2024-10-17',NULL,NULL,1,0,'2024-10-17 05:30:00','2024-10-17 05:30:00',0,0,0,0),(251,1,'GV-01','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(252,2,'GV-02','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(253,3,'GV-03','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(254,4,'GV-04','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(255,5,'GV-05','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(256,6,'GLI0132','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(257,7,'GV-06','2024-10-18',NULL,NULL,1,0,'2024-10-18 05:30:00','2024-10-18 05:30:00',0,0,0,0),(258,1,'GV-01','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(259,2,'GV-02','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(260,3,'GV-03','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(261,4,'GV-04','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(262,5,'GV-05','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(263,6,'GLI0132','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(264,7,'GV-06','2024-10-19',NULL,NULL,1,0,'2024-10-19 05:30:00','2024-10-19 05:30:00',0,0,0,0),(265,1,'GV-01','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(266,2,'GV-02','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(267,3,'GV-03','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(268,4,'GV-04','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(269,5,'GV-05','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(270,6,'GLI0132','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(271,7,'GV-06','2024-10-20',NULL,NULL,1,0,'2024-10-20 05:30:00','2024-10-20 05:30:00',0,0,0,0),(272,1,'GV-01','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(273,2,'GV-02','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(274,3,'GV-03','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(275,4,'GV-04','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(276,5,'GV-05','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(277,6,'GLI0132','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(278,7,'GV-06','2024-10-21',NULL,NULL,1,0,'2024-10-21 05:30:00','2024-10-21 05:30:00',0,0,0,0),(279,1,'GV-01','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(280,2,'GV-02','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(281,3,'GV-03','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(282,4,'GV-04','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(283,5,'GV-05','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(284,6,'GLI0132','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(285,7,'GV-06','2024-10-22',NULL,NULL,1,0,'2024-10-22 05:30:00','2024-10-22 05:30:00',0,0,0,0),(286,1,'GV-01','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(287,2,'GV-02','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(288,3,'GV-03','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(289,4,'GV-04','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(290,5,'GV-05','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(291,6,'GLI0132','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(292,7,'GV-06','2024-10-23',NULL,NULL,1,0,'2024-10-23 05:30:00','2024-10-23 05:30:00',0,0,0,0),(293,1,'GV-01','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(294,2,'GV-02','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(295,3,'GV-03','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(296,4,'GV-04','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(297,5,'GV-05','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(298,6,'GLI0132','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(299,7,'GV-06','2024-10-24',NULL,NULL,1,0,'2024-10-24 05:30:00','2024-10-24 05:30:00',0,0,0,0),(300,1,'GV-01','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(301,2,'GV-02','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(302,3,'GV-03','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(303,4,'GV-04','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(304,5,'GV-05','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(305,6,'GLI0132','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(306,7,'GV-06','2024-10-25',NULL,NULL,1,0,'2024-10-25 05:30:00','2024-10-25 05:30:00',0,0,0,0),(307,1,'GV-01','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(308,2,'GV-02','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(309,3,'GV-03','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(310,4,'GV-04','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(311,5,'GV-05','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(312,6,'GLI0132','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(313,7,'GV-06','2024-11-09',NULL,NULL,1,0,'2024-11-09 05:30:00','2024-11-09 05:30:00',0,0,0,0),(314,1,'GV-01','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:00',0,0,0,0),(315,2,'GV-02','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:00',0,0,0,0),(316,3,'GV-03','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:00',0,0,0,0),(317,4,'GV-04','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:00',0,0,0,0),(318,5,'GV-05','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:01',0,0,0,0),(319,6,'GLI0132','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:01',0,0,0,0),(320,7,'GV-06','2024-11-10',NULL,NULL,1,0,'2024-11-10 05:30:00','2024-11-10 05:30:01',0,0,0,0),(321,1,'GV-01','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(322,2,'GV-02','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(323,3,'GV-03','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(324,4,'GV-04','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(325,5,'GV-05','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(326,6,'GLI0132','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(327,7,'GV-06','2024-11-11',NULL,NULL,1,0,'2024-11-11 05:30:00','2024-11-11 05:30:00',0,0,0,0),(328,1,'GV-01','2024-11-13','2024-12-09 05:57:45','2024-12-09 06:58:52',1,0,'2024-11-13 05:30:00','2024-11-13 12:28:52',0,0,0,0),(329,2,'GV-02','2024-11-13',NULL,NULL,1,0,'2024-11-13 05:30:00','2024-11-13 05:30:00',0,0,0,0),(330,3,'GV-03','2024-11-13',NULL,NULL,1,0,'2024-11-13 05:30:00','2024-11-13 05:30:00',0,0,0,0),(331,4,'GV-04','2024-11-13','2024-12-09 05:07:13',NULL,1,0,'2024-11-13 05:30:00','2024-11-13 10:37:13',0,0,0,0),(332,5,'GV-05','2024-11-13',NULL,NULL,1,0,'2024-11-13 05:30:00','2024-11-13 05:30:00',0,0,0,0),(333,6,'GLI0132','2024-11-13',NULL,NULL,1,0,'2024-11-13 05:30:00','2024-11-13 05:30:00',0,0,0,0),(334,7,'GV-06','2024-11-13',NULL,NULL,1,0,'2024-11-13 05:30:00','2024-11-13 05:30:00',0,0,0,0),(335,1,'GV-01','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(336,2,'GV-02','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(337,3,'GV-03','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(338,4,'GV-04','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(339,5,'GV-05','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(340,6,'GLI0132','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(341,7,'GV-06','2024-11-14',NULL,NULL,1,0,'2024-11-14 05:30:00','2024-11-14 05:30:00',0,0,0,0),(342,1,'GV-01','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(343,2,'GV-02','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(344,3,'GV-03','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(345,4,'GV-04','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(346,5,'GV-05','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(347,6,'GLI0132','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(348,7,'GV-06','2024-11-15',NULL,NULL,1,0,'2024-11-15 05:30:00','2024-11-15 05:30:00',0,0,0,0),(349,1,'GV-01','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(350,2,'GV-02','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(351,3,'GV-03','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(352,4,'GV-04','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(353,5,'GV-05','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(354,6,'GLI0132','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(355,7,'GV-06','2024-11-16',NULL,NULL,1,0,'2024-11-16 05:30:00','2024-11-16 05:30:00',0,0,0,0),(356,1,'GV-01','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(357,2,'GV-02','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(358,3,'GV-03','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(359,4,'GV-04','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(360,5,'GV-05','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(361,6,'GLI0132','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(362,7,'GV-06','2024-11-17',NULL,NULL,1,0,'2024-11-17 05:30:00','2024-11-17 05:30:00',0,0,0,0),(363,1,'GV-01','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(364,2,'GV-02','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(365,3,'GV-03','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(366,4,'GV-04','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(367,5,'GV-05','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(368,6,'GLI0132','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(369,7,'GV-06','2024-11-18',NULL,NULL,1,0,'2024-11-18 05:30:00','2024-11-18 05:30:00',0,0,0,0),(370,1,'GV-01','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:00',0,0,0,0),(371,2,'GV-02','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:00',0,0,0,0),(372,3,'GV-03','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:00',0,0,0,0),(373,4,'GV-04','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:01',0,0,0,0),(374,5,'GV-05','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:01',0,0,0,0),(375,6,'GLI0132','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:01',0,0,0,0),(376,7,'GV-06','2024-11-19',NULL,NULL,1,0,'2024-11-19 05:30:00','2024-11-19 05:30:01',0,0,0,0),(377,1,'GV-01','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(378,2,'GV-02','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(379,3,'GV-03','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(380,4,'GV-04','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(381,5,'GV-05','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(382,6,'GLI0132','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(383,7,'GV-06','2024-12-10',NULL,NULL,1,0,'2024-12-10 00:00:00','2024-12-10 00:00:00',0,0,0,0),(384,1,'GV-01','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(385,2,'GV-02','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(386,3,'GV-03','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(387,4,'GV-04','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(388,5,'GV-05','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(389,6,'GLI0132','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(390,7,'GV-06','2024-12-11',NULL,NULL,1,0,'2024-12-11 00:00:00','2024-12-11 00:00:00',0,0,0,0),(391,1,'GV-01','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(392,2,'GV-02','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(393,3,'GV-03','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(394,4,'GV-04','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(395,5,'GV-05','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(396,6,'GLI0132','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(397,7,'GV-06','2024-12-12',NULL,NULL,1,0,'2024-12-12 00:00:00','2024-12-12 00:00:00',0,0,0,0),(398,1,'GV-01','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(399,2,'GV-02','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(400,3,'GV-03','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(401,4,'GV-04','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(402,5,'GV-05','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(403,6,'GLI0132','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(404,7,'GV-06','2024-12-13',NULL,NULL,1,0,'2024-12-13 00:00:00','2024-12-13 00:00:00',0,0,0,0),(405,1,'GV-01','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(406,2,'GV-02','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(407,3,'GV-03','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(408,4,'GV-04','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(409,5,'GV-05','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(410,6,'GLI0132','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(411,7,'GV-06','2024-12-14',NULL,NULL,1,0,'2024-12-14 00:00:00','2024-12-14 00:00:00',0,0,0,0),(412,1,'GV-01','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(413,2,'GV-02','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(414,3,'GV-03','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(415,4,'GV-04','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(416,5,'GV-05','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(417,6,'GLI0132','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(418,7,'GV-06','2024-12-15',NULL,NULL,1,0,'2024-12-15 00:00:00','2024-12-15 00:00:00',0,0,0,0),(419,1,'GV-01','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(420,2,'GV-02','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(421,3,'GV-03','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(422,4,'GV-04','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(423,5,'GV-05','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(424,6,'GLI0132','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(425,7,'GV-06','2024-12-16',NULL,NULL,1,0,'2024-12-16 00:00:00','2024-12-16 00:00:00',0,0,0,0),(426,1,'GV-01','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:00',0,0,0,0),(427,2,'GV-02','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:00',0,0,0,0),(428,3,'GV-03','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:01',0,0,0,0),(429,4,'GV-04','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:01',0,0,0,0),(430,5,'GV-05','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:01',0,0,0,0),(431,6,'GLI0132','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:01',0,0,0,0),(432,7,'GV-06','2024-12-17',NULL,NULL,1,0,'2024-12-17 00:00:00','2024-12-17 00:00:01',0,0,0,0),(433,1,'GV-01','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(434,2,'GV-02','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(435,3,'GV-03','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(436,4,'GV-04','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(437,5,'GV-05','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(438,6,'GLI0132','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(439,7,'GV-06','2024-12-18',NULL,NULL,1,0,'2024-12-18 00:00:00','2024-12-18 00:00:00',0,0,0,0),(440,1,'GV-01','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(441,2,'GV-02','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(442,3,'GV-03','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(443,4,'GV-04','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(444,5,'GV-05','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(445,6,'GLI0132','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(446,7,'GV-06','2024-12-19',NULL,NULL,1,0,'2024-12-19 00:00:00','2024-12-19 00:00:00',0,0,0,0),(447,1,'GV-01','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(448,2,'GV-02','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(449,3,'GV-03','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(450,4,'GV-04','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(451,5,'GV-05','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(452,6,'GLI0132','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(453,7,'GV-06','2024-12-20',NULL,NULL,1,0,'2024-12-20 00:00:00','2024-12-20 00:00:00',0,0,0,0),(454,1,'GV-01','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(455,2,'GV-02','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(456,3,'GV-03','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(457,4,'GV-04','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(458,5,'GV-05','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(459,6,'GLI0132','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(460,7,'GV-06','2024-12-21',NULL,NULL,1,0,'2024-12-21 00:00:00','2024-12-21 00:00:00',0,0,0,0),(461,1,'GV-01','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(462,2,'GV-02','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(463,3,'GV-03','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(464,4,'GV-04','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(465,5,'GV-05','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(466,6,'GLI0132','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(467,7,'GV-06','2024-12-22',NULL,NULL,1,0,'2024-12-22 00:00:00','2024-12-22 00:00:00',0,0,0,0),(468,1,'GV-01','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(469,2,'GV-02','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(470,3,'GV-03','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(471,4,'GV-04','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(472,5,'GV-05','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(473,6,'GLI0132','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(474,7,'GV-06','2024-12-23',NULL,NULL,1,0,'2024-12-23 00:00:00','2024-12-23 00:00:00',0,0,0,0),(475,1,'GV-01','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(476,2,'GV-02','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(477,3,'GV-03','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(478,4,'GV-04','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(479,5,'GV-05','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(480,6,'GLI0132','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(481,7,'GV-06','2024-12-24',NULL,NULL,1,0,'2024-12-24 00:00:00','2024-12-24 00:00:00',0,0,0,0),(482,1,'GV-01','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(483,2,'GV-02','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(484,3,'GV-03','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(485,4,'GV-04','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(486,5,'GV-05','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(487,6,'GLI0132','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(488,7,'GV-06','2024-12-25',NULL,NULL,1,0,'2024-12-25 00:00:00','2024-12-25 00:00:00',0,0,0,0),(489,1,'GV-01','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(490,2,'GV-02','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(491,3,'GV-03','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(492,4,'GV-04','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(493,5,'GV-05','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(494,6,'GLI0132','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(495,7,'GV-06','2024-12-26',NULL,NULL,1,0,'2024-12-26 00:00:00','2024-12-26 00:00:01',0,0,0,0),(496,1,'GV-01','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(497,2,'GV-02','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(498,3,'GV-03','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(499,4,'GV-04','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(500,5,'GV-05','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(501,6,'GLI0132','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(502,7,'GV-06','2024-12-27',NULL,NULL,1,0,'2024-12-27 00:00:00','2024-12-27 00:00:01',0,0,0,0),(503,1,'GV-01','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(504,2,'GV-02','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(505,3,'GV-03','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(506,4,'GV-04','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(507,5,'GV-05','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(508,6,'GLI0132','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(509,7,'GV-06','2024-12-28',NULL,NULL,1,0,'2024-12-28 00:00:00','2024-12-28 00:00:00',0,0,0,0),(510,1,'GV-01','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(511,2,'GV-02','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(512,3,'GV-03','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(513,4,'GV-04','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(514,5,'GV-05','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(515,6,'GLI0132','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(516,7,'GV-06','2024-12-29',NULL,NULL,1,0,'2024-12-29 00:00:00','2024-12-29 00:00:00',0,0,0,0),(517,1,'GV-01','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(518,2,'GV-02','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(519,3,'GV-03','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(520,4,'GV-04','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(521,5,'GV-05','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(522,6,'GLI0132','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(523,7,'GV-06','2024-12-30',NULL,NULL,1,0,'2024-12-30 00:00:00','2024-12-30 00:00:00',0,0,0,0),(524,1,'GV-01','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(525,2,'GV-02','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(526,3,'GV-03','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(527,4,'GV-04','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(528,5,'GV-05','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(529,6,'GLI0132','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(530,7,'GV-06','2025-02-05',NULL,NULL,1,0,'2025-02-05 00:00:00','2025-02-05 00:00:00',0,0,0,0),(531,1,'GV-01','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(532,2,'GV-02','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(533,3,'GV-03','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(534,4,'GV-04','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(535,5,'GV-05','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(536,6,'GLI0132','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(537,7,'GV-06','2025-02-06',NULL,NULL,1,0,'2025-02-06 00:00:00','2025-02-06 00:00:00',0,0,0,0),(538,1,'GV-01','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:00',0,0,0,0),(539,2,'GV-02','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:00',0,0,0,0),(540,3,'GV-03','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:00',0,0,0,0),(541,4,'GV-04','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:00',0,0,0,0),(542,5,'GV-05','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:00',0,0,0,0),(543,6,'GLI0132','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:00',0,0,0,0),(544,7,'GV-06','2025-02-07',NULL,NULL,1,0,'2025-02-07 00:00:00','2025-02-07 00:00:01',0,0,0,0),(545,1,'GV-01','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(546,2,'GV-02','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(547,3,'GV-03','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(548,4,'GV-04','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(549,5,'GV-05','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(550,6,'GLI0132','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(551,7,'GV-06','2025-02-08',NULL,NULL,1,0,'2025-02-08 00:00:00','2025-02-08 00:00:00',0,0,0,0),(552,1,'GV-01','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:00',0,0,0,0),(553,2,'GV-02','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:00',0,0,0,0),(554,3,'GV-03','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:00',0,0,0,0),(555,4,'GV-04','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:00',0,0,0,0),(556,5,'GV-05','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:01',0,0,0,0),(557,6,'GLI0132','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:01',0,0,0,0),(558,7,'GV-06','2025-02-09',NULL,NULL,1,0,'2025-02-09 00:00:00','2025-02-09 00:00:01',0,0,0,0),(559,1,'GV-01','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(560,2,'GV-02','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(561,3,'GV-03','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(562,4,'GV-04','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(563,5,'GV-05','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(564,6,'GLI0132','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(565,7,'GV-06','2025-02-10',NULL,NULL,1,0,'2025-02-10 00:00:00','2025-02-10 00:00:00',0,0,0,0),(566,1,'GV-01','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(567,2,'GV-02','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(568,3,'GV-03','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(569,4,'GV-04','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(570,5,'GV-05','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(571,6,'GLI0132','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(572,7,'GV-06','2025-02-11',NULL,NULL,1,0,'2025-02-11 00:00:01','2025-02-11 00:00:01',0,0,0,0),(573,1,'GV-01','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:00',0,0,0,0),(574,2,'GV-02','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:00',0,0,0,0),(575,3,'GV-03','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:00',0,0,0,0),(576,4,'GV-04','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:00',0,0,0,0),(577,5,'GV-05','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:00',0,0,0,0),(578,6,'GLI0132','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:00',0,0,0,0),(579,7,'GV-06','2025-02-14',NULL,NULL,1,0,'2025-02-14 00:00:00','2025-02-14 00:00:01',0,0,0,0),(580,1,'GV-01','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(581,2,'GV-02','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(582,3,'GV-03','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(583,4,'GV-04','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(584,5,'GV-05','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(585,6,'GLI0132','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(586,7,'GV-06','2025-02-15',NULL,NULL,1,0,'2025-02-15 00:00:00','2025-02-15 00:00:00',0,0,0,0),(587,1,'GV-01','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(588,2,'GV-02','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(589,3,'GV-03','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(590,4,'GV-04','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(591,5,'GV-05','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(592,6,'GLI0132','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(593,7,'GV-06','2025-02-18',NULL,NULL,1,0,'2025-02-18 00:00:00','2025-02-18 00:00:00',0,0,0,0),(594,1,'GV-01','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:00',0,0,0,0),(595,2,'GV-02','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:00',0,0,0,0),(596,3,'GV-03','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:00',0,0,0,0),(597,4,'GV-04','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:00',0,0,0,0),(598,5,'GV-05','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:01',0,0,0,0),(599,6,'GLI0132','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:01',0,0,0,0),(600,7,'GV-06','2025-02-19',NULL,NULL,1,0,'2025-02-19 00:00:00','2025-02-19 00:00:01',0,0,0,0),(601,1,'GV-01','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(602,2,'GV-02','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(603,3,'GV-03','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(604,4,'GV-04','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(605,5,'GV-05','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(606,6,'GLI0132','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(607,7,'GV-06','2025-02-20',NULL,NULL,1,0,'2025-02-20 00:00:00','2025-02-20 00:00:00',0,0,0,0),(608,1,'GV-01','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(609,2,'GV-02','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(610,3,'GV-03','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(611,4,'GV-04','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(612,5,'GV-05','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(613,6,'GLI0132','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(614,7,'GV-06','2025-03-01',NULL,NULL,1,0,'2025-03-01 00:00:00','2025-03-01 00:00:00',0,0,0,0),(615,1,'GV-01','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(616,2,'GV-02','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(617,3,'GV-03','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(618,4,'GV-04','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(619,5,'GV-05','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(620,6,'GLI0132','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(621,7,'GV-06','2025-03-02',NULL,NULL,1,0,'2025-03-02 00:00:00','2025-03-02 00:00:00',0,0,0,0),(622,1,'GV-01','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(623,2,'GV-02','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(624,3,'GV-03','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(625,4,'GV-04','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(626,5,'GV-05','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(627,6,'GLI0132','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(628,7,'GV-06','2025-03-03',NULL,NULL,1,0,'2025-03-03 00:00:00','2025-03-03 00:00:01',0,0,0,0),(629,1,'GV-01','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(630,2,'GV-02','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(631,3,'GV-03','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(632,4,'GV-04','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(633,5,'GV-05','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(634,6,'GLI0132','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(635,7,'GV-06','2025-03-04',NULL,NULL,1,0,'2025-03-04 00:00:00','2025-03-04 00:00:00',0,0,0,0),(636,1,'GV-01','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(637,2,'GV-02','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(638,3,'GV-03','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(639,4,'GV-04','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(640,5,'GV-05','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(641,6,'GLI0132','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(642,7,'GV-06','2025-03-05',NULL,NULL,1,0,'2025-03-05 00:00:00','2025-03-05 00:00:00',0,0,0,0),(643,1,'GV-01','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(644,2,'GV-02','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(645,3,'GV-03','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(646,4,'GV-04','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(647,5,'GV-05','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(648,6,'GLI0132','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(649,7,'GV-06','2025-03-06',NULL,NULL,1,0,'2025-03-06 00:00:00','2025-03-06 00:00:00',0,0,0,0),(650,1,'GV-01','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(651,2,'GV-02','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(652,3,'GV-03','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(653,4,'GV-04','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(654,5,'GV-05','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(655,6,'GLI0132','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(656,7,'GV-06','2025-03-07',NULL,NULL,1,0,'2025-03-07 00:00:00','2025-03-07 00:00:00',0,0,0,0),(657,1,'GV-01','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(658,2,'GV-02','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(659,3,'GV-03','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(660,4,'GV-04','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(661,5,'GV-05','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(662,6,'GLI0132','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(663,7,'GV-06','2025-03-08',NULL,NULL,1,0,'2025-03-08 00:00:00','2025-03-08 00:00:00',0,0,0,0),(664,1,'GV-01','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(665,2,'GV-02','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(666,3,'GV-03','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(667,4,'GV-04','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(668,5,'GV-05','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(669,6,'GLI0132','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(670,7,'GV-06','2025-03-09',NULL,NULL,1,0,'2025-03-09 00:00:00','2025-03-09 00:00:00',0,0,0,0),(671,1,'GV-01','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:00',0,0,0,0),(672,2,'GV-02','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:00',0,0,0,0),(673,3,'GV-03','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:00',0,0,0,0),(674,4,'GV-04','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:00',0,0,0,0),(675,5,'GV-05','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:01',0,0,0,0),(676,6,'GLI0132','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:01',0,0,0,0),(677,7,'GV-06','2025-03-10',NULL,NULL,1,0,'2025-03-10 00:00:00','2025-03-10 00:00:01',0,0,0,0),(678,1,'GV-01','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(679,2,'GV-02','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(680,3,'GV-03','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(681,4,'GV-04','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(682,5,'GV-05','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(683,6,'GLI0132','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(684,7,'GV-06','2025-03-11',NULL,NULL,1,0,'2025-03-11 00:00:00','2025-03-11 00:00:00',0,0,0,0),(685,1,'GV-01','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(686,2,'GV-02','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(687,3,'GV-03','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(688,4,'GV-04','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(689,5,'GV-05','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(690,6,'GLI0132','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(691,7,'GV-06','2025-03-12',NULL,NULL,1,0,'2025-03-12 00:00:00','2025-03-12 00:00:00',0,0,0,0),(692,1,'GV-01','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(693,2,'GV-02','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(694,3,'GV-03','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(695,4,'GV-04','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(696,5,'GV-05','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(697,6,'GLI0132','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(698,7,'GV-06','2025-03-13',NULL,NULL,1,0,'2025-03-13 00:00:00','2025-03-13 00:00:00',0,0,0,0),(699,1,'GV-01','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(700,2,'GV-02','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(701,3,'GV-03','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(702,4,'GV-04','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(703,5,'GV-05','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(704,6,'GLI0132','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(705,7,'GV-06','2025-03-14',NULL,NULL,1,0,'2025-03-14 00:00:00','2025-03-14 00:00:00',0,0,0,0),(706,1,'GV-01','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(707,2,'GV-02','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(708,3,'GV-03','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(709,4,'GV-04','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(710,5,'GV-05','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(711,6,'GLI0132','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(712,7,'GV-06','2025-03-15',NULL,NULL,1,0,'2025-03-15 00:00:00','2025-03-15 00:00:00',0,0,0,0),(713,1,'GV-01','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(714,2,'GV-02','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(715,3,'GV-03','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(716,4,'GV-04','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(717,5,'GV-05','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(718,6,'GLI0132','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(719,7,'GV-06','2025-03-16',NULL,NULL,1,0,'2025-03-16 00:00:00','2025-03-16 00:00:00',0,0,0,0),(720,1,'GV-01','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(721,2,'GV-02','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(722,3,'GV-03','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(723,4,'GV-04','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(724,5,'GV-05','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(725,6,'GLI0132','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(726,7,'GV-06','2025-03-17',NULL,NULL,1,0,'2025-03-17 00:00:00','2025-03-17 00:00:00',0,0,0,0),(727,1,'GV-01','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(728,2,'GV-02','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(729,3,'GV-03','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(730,4,'GV-04','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(731,5,'GV-05','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(732,6,'GLI0132','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(733,7,'GV-06','2025-03-18',NULL,NULL,1,0,'2025-03-18 00:00:00','2025-03-18 00:00:01',0,0,0,0),(734,1,'GV-01','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(735,2,'GV-02','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(736,3,'GV-03','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(737,4,'GV-04','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(738,5,'GV-05','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(739,6,'GLI0132','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(740,7,'GV-06','2025-03-19',NULL,NULL,1,0,'2025-03-19 00:00:00','2025-03-19 00:00:00',0,0,0,0),(742,1,'GV-01','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(743,2,'GV-02','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(744,3,'GV-03','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(745,4,'GV-04','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(746,5,'GV-05','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(747,6,'GLI0132','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(748,7,'GV-06','2025-03-29',NULL,NULL,1,0,'2025-03-29 00:00:00','2025-03-29 00:00:00',0,0,0,0),(749,1,'GV-01','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(750,2,'GV-02','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(751,3,'GV-03','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(752,4,'GV-04','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(753,5,'GV-05','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(754,6,'GLI0132','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(755,7,'GV-06','2025-03-30',NULL,NULL,1,0,'2025-03-30 00:00:00','2025-03-30 00:00:01',0,0,0,0),(756,1,'GV-01','2025-03-31',NULL,NULL,1,0,'2025-03-31 00:00:00','2025-03-31 00:00:00',0,0,0,0),(757,2,'GV-02','2025-03-31',NULL,NULL,1,0,'2025-03-31 00:00:00','2025-03-31 00:00:00',0,0,0,0),(758,3,'GV-03','2025-03-31',NULL,NULL,1,0,'2025-03-31 00:00:00','2025-03-31 00:00:00',0,0,0,0),(759,4,'GV-04','2025-03-31','2025-03-31 08:21:34',NULL,1,0,'2025-03-31 00:00:00','2025-03-31 08:21:34',0,0,0,0),(760,5,'GV-05','2025-03-31',NULL,NULL,1,0,'2025-03-31 00:00:00','2025-03-31 00:00:00',0,0,0,0),(761,6,'GLI0132','2025-03-31',NULL,NULL,1,0,'2025-03-31 00:00:00','2025-03-31 00:00:00',0,0,0,0),(762,7,'GV-06','2025-03-31',NULL,NULL,1,0,'2025-03-31 00:00:00','2025-03-31 00:00:00',0,0,0,0),(763,1,'GV-01','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(764,2,'GV-02','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(765,3,'GV-03','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(766,4,'GV-04','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(767,5,'GV-05','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(768,6,'GLI0132','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(769,7,'GV-06','2025-04-01',NULL,NULL,1,0,'2025-04-01 00:00:00','2025-04-01 00:00:01',0,0,0,0),(770,1,'GV-01','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:00',0,0,0,0),(771,2,'GV-02','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:00',0,0,0,0),(772,3,'GV-03','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:00',0,0,0,0),(773,4,'GV-04','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:00',0,0,0,0),(774,5,'GV-05','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:00',0,0,0,0),(775,6,'GLI0132','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:00',0,0,0,0),(776,7,'GV-06','2025-04-02',NULL,NULL,1,0,'2025-04-02 00:00:00','2025-04-02 00:00:01',0,0,0,0),(777,1,'GV-01','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(778,2,'GV-02','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(779,3,'GV-03','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(780,4,'GV-04','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(781,5,'GV-05','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(782,6,'GLI0132','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(783,7,'GV-06','2025-04-03',NULL,NULL,1,0,'2025-04-03 00:00:00','2025-04-03 00:00:00',0,0,0,0),(784,1,'GV-01','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:00',0,0,0,0),(785,2,'GV-02','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:00',0,0,0,0),(786,3,'GV-03','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:00',0,0,0,0),(787,4,'GV-04','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:00',0,0,0,0),(788,5,'GV-05','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:00',0,0,0,0),(789,6,'GLI0132','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:01',0,0,0,0),(790,7,'GV-06','2025-04-04',NULL,NULL,1,0,'2025-04-04 00:00:00','2025-04-04 00:00:01',0,0,0,0),(791,1,'GV-01','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:00',0,0,0,0),(792,2,'GV-02','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:00',0,0,0,0),(793,3,'GV-03','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:00',0,0,0,0),(794,4,'GV-04','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:00',0,0,0,0),(795,5,'GV-05','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:00',0,0,0,0),(796,6,'GLI0132','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:00',0,0,0,0),(797,7,'GV-06','2025-04-05',NULL,NULL,1,0,'2025-04-05 00:00:00','2025-04-05 00:00:01',0,0,0,0),(798,1,'GV-01','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(799,2,'GV-02','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(800,3,'GV-03','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(801,4,'GV-04','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(802,5,'GV-05','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(803,6,'GLI0132','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(804,7,'GV-06','2025-04-06',NULL,NULL,1,0,'2025-04-06 00:00:00','2025-04-06 00:00:00',0,0,0,0),(805,1,'GV-01','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(806,2,'GV-02','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(807,3,'GV-03','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(808,4,'GV-04','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(809,5,'GV-05','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(810,6,'GLI0132','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(811,7,'GV-06','2025-04-07',NULL,NULL,1,0,'2025-04-07 00:00:00','2025-04-07 00:00:00',0,0,0,0),(812,1,'GV-01','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(813,2,'GV-02','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(814,3,'GV-03','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(815,4,'GV-04','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(816,5,'GV-05','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(817,6,'GLI0132','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(818,7,'GV-06','2025-04-08',NULL,NULL,1,0,'2025-04-08 00:00:00','2025-04-08 00:00:00',0,0,0,0),(819,1,'GV-01','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(820,2,'GV-02','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(821,3,'GV-03','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(822,4,'GV-04','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(823,5,'GV-05','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(824,6,'GLI0132','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(825,7,'GV-06','2025-04-09',NULL,NULL,1,0,'2025-04-09 00:00:00','2025-04-09 00:00:00',0,0,0,0),(826,1,'GV-01','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(827,2,'GV-02','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(828,3,'GV-03','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(829,4,'GV-04','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(830,5,'GV-05','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(831,6,'GLI0132','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(832,7,'GV-06','2025-04-10',NULL,NULL,1,0,'2025-04-10 00:00:00','2025-04-10 00:00:00',0,0,0,0),(833,1,'GV-01','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(834,2,'GV-02','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(835,3,'GV-03','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(836,4,'GV-04','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(837,5,'GV-05','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(838,6,'GLI0132','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(839,7,'GV-06','2025-04-11',NULL,NULL,1,0,'2025-04-11 00:00:00','2025-04-11 00:00:00',0,0,0,0),(840,1,'GV-01','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(841,2,'GV-02','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(842,3,'GV-03','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(843,4,'GV-04','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(844,5,'GV-05','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(845,6,'GLI0132','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(846,7,'GV-06','2025-04-12',NULL,NULL,1,0,'2025-04-12 00:00:00','2025-04-12 00:00:00',0,0,0,0),(847,1,'GV-01','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:00',0,0,0,0),(848,2,'GV-02','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:01',0,0,0,0),(849,3,'GV-03','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:01',0,0,0,0),(850,4,'GV-04','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:01',0,0,0,0),(851,5,'GV-05','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:01',0,0,0,0),(852,6,'GLI0132','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:01',0,0,0,0),(853,7,'GV-06','2025-04-13',NULL,NULL,1,0,'2025-04-13 00:00:00','2025-04-13 00:00:01',0,0,0,0),(854,1,'GV-01','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:00',0,0,0,0),(855,2,'GV-02','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:00',0,0,0,0),(856,3,'GV-03','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:00',0,0,0,0),(857,4,'GV-04','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:01',0,0,0,0),(858,5,'GV-05','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:01',0,0,0,0),(859,6,'GLI0132','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:01',0,0,0,0),(860,7,'GV-06','2025-04-14',NULL,NULL,1,0,'2025-04-14 00:00:00','2025-04-14 00:00:01',0,0,0,0),(861,1,'GV-01','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(862,2,'GV-02','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(863,3,'GV-03','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(864,4,'GV-04','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(865,5,'GV-05','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(866,6,'GLI0132','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(867,7,'GV-06','2025-04-15',NULL,NULL,1,0,'2025-04-15 00:00:00','2025-04-15 00:00:00',0,0,0,0),(868,1,'GV-01','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(869,2,'GV-02','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(870,3,'GV-03','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(871,4,'GV-04','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(872,5,'GV-05','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(873,6,'GLI0132','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(874,7,'GV-06','2025-04-16',NULL,NULL,1,0,'2025-04-16 00:00:00','2025-04-16 00:00:00',0,0,0,0),(875,1,'GV-01','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(876,2,'GV-02','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(877,3,'GV-03','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(878,4,'GV-04','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(879,5,'GV-05','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(880,6,'GLI0132','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(881,7,'GV-06','2025-04-17',NULL,NULL,1,0,'2025-04-17 00:00:00','2025-04-17 00:00:00',0,0,0,0),(882,1,'GV-01','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(883,2,'GV-02','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(884,3,'GV-03','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(885,4,'GV-04','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(886,5,'GV-05','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(887,6,'GLI0132','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(888,7,'GV-06','2025-04-18',NULL,NULL,1,0,'2025-04-18 00:00:00','2025-04-18 00:00:00',0,0,0,0),(889,1,'GV-01','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:01',0,0,0,0),(890,2,'GV-02','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:01',0,0,0,0),(891,3,'GV-03','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:01',0,0,0,0),(892,4,'GV-04','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:02',0,0,0,0),(893,5,'GV-05','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:02',0,0,0,0),(894,6,'GLI0132','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:02',0,0,0,0),(895,7,'GV-06','2025-04-19',NULL,NULL,1,0,'2025-04-19 00:00:00','2025-04-19 00:00:02',0,0,0,0),(896,1,'GV-01','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(897,2,'GV-02','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(898,3,'GV-03','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(899,4,'GV-04','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(900,5,'GV-05','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(901,6,'GLI0132','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(902,7,'GV-06','2025-04-22',NULL,NULL,1,0,'2025-04-22 00:00:00','2025-04-22 00:00:01',0,0,0,0),(903,1,'GV-01','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(904,2,'GV-02','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(905,3,'GV-03','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(906,4,'GV-04','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(907,5,'GV-05','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(908,6,'GLI0132','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(909,7,'GV-06','2025-04-23',NULL,NULL,1,0,'2025-04-23 00:00:00','2025-04-23 00:00:00',0,0,0,0),(910,1,'GV-01','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(911,2,'GV-02','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(912,3,'GV-03','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(913,4,'GV-04','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(914,5,'GV-05','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(915,6,'GLI0132','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(916,7,'GV-06','2025-04-24',NULL,NULL,1,0,'2025-04-24 00:00:00','2025-04-24 00:00:00',0,0,0,0),(917,1,'GV-01','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(918,2,'GV-02','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(919,3,'GV-03','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(920,4,'GV-04','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(921,5,'GV-05','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(922,6,'GLI0132','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(923,7,'GV-06','2025-04-25',NULL,NULL,1,0,'2025-04-25 00:00:00','2025-04-25 00:00:00',0,0,0,0),(924,1,'GV-01','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:00',0,0,0,0),(925,2,'GV-02','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:00',0,0,0,0),(926,3,'GV-03','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:00',0,0,0,0),(927,4,'GV-04','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:01',0,0,0,0),(928,5,'GV-05','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:01',0,0,0,0),(929,6,'GLI0132','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:01',0,0,0,0),(930,7,'GV-06','2025-04-26',NULL,NULL,1,0,'2025-04-26 00:00:00','2025-04-26 00:00:01',0,0,0,0),(931,1,'GV-01','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(932,2,'GV-02','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(933,3,'GV-03','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(934,4,'GV-04','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(935,5,'GV-05','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(936,6,'GLI0132','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(937,7,'GV-06','2025-04-27',NULL,NULL,1,0,'2025-04-27 00:00:00','2025-04-27 00:00:00',0,0,0,0),(938,1,'GV-01','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(939,2,'GV-02','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(940,3,'GV-03','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(941,4,'GV-04','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(942,5,'GV-05','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(943,6,'GLI0132','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(944,7,'GV-06','2025-04-28',NULL,NULL,1,0,'2025-04-28 00:00:01','2025-04-28 00:00:01',0,0,0,0),(945,1,'GV-01','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(946,2,'GV-02','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(947,3,'GV-03','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(948,4,'GV-04','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(949,5,'GV-05','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(950,6,'GLI0132','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(951,7,'GV-06','2025-04-29',NULL,NULL,1,0,'2025-04-29 00:00:00','2025-04-29 00:00:00',0,0,0,0),(952,1,'GV-01','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:00',0,0,0,0),(953,2,'GV-02','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:00',0,0,0,0),(954,3,'GV-03','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:00',0,0,0,0),(955,4,'GV-04','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:01',0,0,0,0),(956,5,'GV-05','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:01',0,0,0,0),(957,6,'GLI0132','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:01',0,0,0,0),(958,7,'GV-06','2025-04-30',NULL,NULL,1,0,'2025-04-30 00:00:00','2025-04-30 00:00:01',0,0,0,0),(959,1,'GV-01','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:00',0,0,0,0),(960,2,'GV-02','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:00',0,0,0,0),(961,3,'GV-03','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:00',0,0,0,0),(962,4,'GV-04','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:01',0,0,0,0),(963,5,'GV-05','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:01',0,0,0,0),(964,6,'GLI0132','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:01',0,0,0,0),(965,7,'GV-06','2025-05-01',NULL,NULL,1,0,'2025-05-01 00:00:00','2025-05-01 00:00:01',0,0,0,0),(966,1,'GV-01','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(967,2,'GV-02','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(968,3,'GV-03','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(969,4,'GV-04','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(970,5,'GV-05','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(971,6,'GLI0132','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(972,7,'GV-06','2025-05-02',NULL,NULL,1,0,'2025-05-02 00:00:00','2025-05-02 00:00:00',0,0,0,0),(973,1,'GV-01','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(974,2,'GV-02','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(975,3,'GV-03','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(976,4,'GV-04','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(977,5,'GV-05','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(978,6,'GLI0132','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(979,7,'GV-06','2025-05-03',NULL,NULL,1,0,'2025-05-03 00:00:00','2025-05-03 00:00:00',0,0,0,0),(980,1,'GV-01','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:01',0,0,0,0),(981,2,'GV-02','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:01',0,0,0,0),(982,3,'GV-03','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:01',0,0,0,0),(983,4,'GV-04','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:02',0,0,0,0),(984,5,'GV-05','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:02',0,0,0,0),(985,6,'GLI0132','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:02',0,0,0,0),(986,7,'GV-06','2025-05-04',NULL,NULL,1,0,'2025-05-04 00:00:00','2025-05-04 00:00:03',0,0,0,0),(987,1,'GV-01','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:00',0,0,0,0),(988,2,'GV-02','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:00',0,0,0,0),(989,3,'GV-03','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:01',0,0,0,0),(990,4,'GV-04','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:01',0,0,0,0),(991,5,'GV-05','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:01',0,0,0,0),(992,6,'GLI0132','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:01',0,0,0,0),(993,7,'GV-06','2025-05-05',NULL,NULL,1,0,'2025-05-05 00:00:00','2025-05-05 00:00:01',0,0,0,0),(994,1,'GV-01','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:01',0,0,0,0),(995,2,'GV-02','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:01',0,0,0,0),(996,3,'GV-03','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:02',0,0,0,0),(997,4,'GV-04','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:02',0,0,0,0),(998,5,'GV-05','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:02',0,0,0,0),(999,6,'GLI0132','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:03',0,0,0,0),(1000,7,'GV-06','2025-05-06',NULL,NULL,1,0,'2025-05-06 00:00:00','2025-05-06 00:00:03',0,0,0,0),(1001,1,'GV-01','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1002,2,'GV-02','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1003,3,'GV-03','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1004,4,'GV-04','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1005,5,'GV-05','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1006,6,'GLI0132','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1007,7,'GV-06','2025-05-07',NULL,NULL,1,0,'2025-05-07 00:00:00','2025-05-07 00:00:00',0,0,0,0),(1008,1,'GV-01','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:00',0,0,0,0),(1009,2,'GV-02','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:00',0,0,0,0),(1010,3,'GV-03','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:00',0,0,0,0),(1011,4,'GV-04','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:01',0,0,0,0),(1012,5,'GV-05','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:01',0,0,0,0),(1013,6,'GLI0132','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:01',0,0,0,0),(1014,7,'GV-06','2025-05-08',NULL,NULL,1,0,'2025-05-08 00:00:00','2025-05-08 00:00:01',0,0,0,0),(1015,1,'GV-01','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1016,2,'GV-02','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1017,3,'GV-03','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1018,4,'GV-04','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1019,5,'GV-05','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1020,6,'GLI0132','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1021,7,'GV-06','2025-05-09',NULL,NULL,1,0,'2025-05-09 00:00:00','2025-05-09 00:00:00',0,0,0,0),(1022,1,'GV-01','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:00',0,0,0,0),(1023,2,'GV-02','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:00',0,0,0,0),(1024,3,'GV-03','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:00',0,0,0,0),(1025,4,'GV-04','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:01',0,0,0,0),(1026,5,'GV-05','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:01',0,0,0,0),(1027,6,'GLI0132','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:01',0,0,0,0),(1028,7,'GV-06','2025-05-10',NULL,NULL,1,0,'2025-05-10 00:00:00','2025-05-10 00:00:01',0,0,0,0),(1029,1,'GV-01','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1030,2,'GV-02','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1031,3,'GV-03','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1032,4,'GV-04','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1033,5,'GV-05','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1034,6,'GLI0132','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1035,7,'GV-06','2025-05-11',NULL,NULL,1,0,'2025-05-11 00:00:00','2025-05-11 00:00:00',0,0,0,0),(1036,1,'GV-01','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:00',0,0,0,0),(1037,2,'GV-02','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:00',0,0,0,0),(1038,3,'GV-03','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:00',0,0,0,0),(1039,4,'GV-04','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:00',0,0,0,0),(1040,5,'GV-05','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:01',0,0,0,0),(1041,6,'GLI0132','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:01',0,0,0,0),(1042,7,'GV-06','2025-05-12',NULL,NULL,1,0,'2025-05-12 00:00:00','2025-05-12 00:00:01',0,0,0,0),(1043,1,'GV-01','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1044,2,'GV-02','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1045,3,'GV-03','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1046,4,'GV-04','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1047,5,'GV-05','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1048,6,'GLI0132','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1049,7,'GV-06','2025-05-13',NULL,NULL,1,0,'2025-05-13 00:00:00','2025-05-13 00:00:00',0,0,0,0),(1050,1,'GV-01','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1051,2,'GV-02','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1052,3,'GV-03','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1053,4,'GV-04','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1054,5,'GV-05','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1055,6,'GLI0132','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1056,7,'GV-06','2025-05-14',NULL,NULL,1,0,'2025-05-14 00:00:00','2025-05-14 00:00:00',0,0,0,0),(1057,1,'GV-01','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1058,2,'GV-02','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1059,3,'GV-03','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1060,4,'GV-04','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1061,5,'GV-05','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1062,6,'GLI0132','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1063,7,'GV-06','2025-05-15',NULL,NULL,1,0,'2025-05-15 00:00:00','2025-05-15 00:00:00',0,0,0,0),(1064,1,'GV-01','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:01',0,0,0,0),(1065,2,'GV-02','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:01',0,0,0,0),(1066,3,'GV-03','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:01',0,0,0,0),(1067,4,'GV-04','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:02',0,0,0,0),(1068,5,'GV-05','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:02',0,0,0,0),(1069,6,'GLI0132','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:02',0,0,0,0),(1070,7,'GV-06','2025-05-16',NULL,NULL,1,0,'2025-05-16 00:00:01','2025-05-16 00:00:03',0,0,0,0),(1071,1,'GV-01','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1072,2,'GV-02','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1073,3,'GV-03','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1074,4,'GV-04','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1075,5,'GV-05','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1076,6,'GLI0132','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1077,7,'GV-06','2025-05-17',NULL,NULL,1,0,'2025-05-17 00:00:00','2025-05-17 00:00:00',0,0,0,0),(1078,1,'GV-01','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1079,2,'GV-02','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1080,3,'GV-03','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1081,4,'GV-04','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1082,5,'GV-05','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1083,6,'GLI0132','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1084,7,'GV-06','2025-05-18',NULL,NULL,1,0,'2025-05-18 00:00:00','2025-05-18 00:00:00',0,0,0,0),(1085,1,'GV-01','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:00',0,0,0,0),(1086,2,'GV-02','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:00',0,0,0,0),(1087,3,'GV-03','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:01',0,0,0,0),(1088,4,'GV-04','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:01',0,0,0,0),(1089,5,'GV-05','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:01',0,0,0,0),(1090,6,'GLI0132','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:01',0,0,0,0),(1091,7,'GV-06','2025-05-19',NULL,NULL,1,0,'2025-05-19 00:00:00','2025-05-19 00:00:01',0,0,0,0),(1092,1,'GV-01','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1093,2,'GV-02','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1094,3,'GV-03','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1095,4,'GV-04','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1096,5,'GV-05','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1097,6,'GLI0132','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1098,7,'GV-06','2025-05-20',NULL,NULL,1,0,'2025-05-20 00:00:00','2025-05-20 00:00:00',0,0,0,0),(1099,1,'GV-01','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:00',0,0,0,0),(1100,2,'GV-02','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:00',0,0,0,0),(1101,3,'GV-03','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:01',0,0,0,0),(1102,4,'GV-04','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:01',0,0,0,0),(1103,5,'GV-05','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:01',0,0,0,0),(1104,6,'GLI0132','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:01',0,0,0,0),(1105,7,'GV-06','2025-05-21',NULL,NULL,1,0,'2025-05-21 00:00:00','2025-05-21 00:00:02',0,0,0,0),(1106,1,'GV-01','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1107,2,'GV-02','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1108,3,'GV-03','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1109,4,'GV-04','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1110,5,'GV-05','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1111,6,'GLI0132','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1112,7,'GV-06','2025-05-22',NULL,NULL,1,0,'2025-05-22 00:00:00','2025-05-22 00:00:00',0,0,0,0),(1113,1,'GV-01','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:01',0,0,0,0),(1114,2,'GV-02','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:01',0,0,0,0),(1115,3,'GV-03','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:01',0,0,0,0),(1116,4,'GV-04','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:01',0,0,0,0),(1117,5,'GV-05','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:02',0,0,0,0),(1118,6,'GLI0132','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:02',0,0,0,0),(1119,7,'GV-06','2025-05-23',NULL,NULL,1,0,'2025-05-23 00:00:00','2025-05-23 00:00:02',0,0,0,0),(1120,1,'GV-01','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1121,2,'GV-02','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1122,3,'GV-03','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1123,4,'GV-04','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1124,5,'GV-05','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1125,6,'GLI0132','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1126,7,'GV-06','2025-05-24',NULL,NULL,1,0,'2025-05-24 00:00:00','2025-05-24 00:00:00',0,0,0,0),(1127,1,'GV-01','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1128,2,'GV-02','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1129,3,'GV-03','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1130,4,'GV-04','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1131,5,'GV-05','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1132,6,'GLI0132','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1133,7,'GV-06','2025-05-25',NULL,NULL,1,0,'2025-05-25 00:00:00','2025-05-25 00:00:00',0,0,0,0),(1134,1,'GV-01','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1135,2,'GV-02','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1136,3,'GV-03','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1137,4,'GV-04','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1138,5,'GV-05','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1139,6,'GLI0132','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1140,7,'GV-06','2025-05-26',NULL,NULL,1,0,'2025-05-26 00:00:00','2025-05-26 00:00:00',0,0,0,0),(1141,1,'GV-01','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:00',0,0,0,0),(1142,2,'GV-02','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:00',0,0,0,0),(1143,3,'GV-03','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:01',0,0,0,0),(1144,4,'GV-04','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:01',0,0,0,0),(1145,5,'GV-05','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:01',0,0,0,0),(1146,6,'GLI0132','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:01',0,0,0,0),(1147,7,'GV-06','2025-05-27',NULL,NULL,1,0,'2025-05-27 00:00:00','2025-05-27 00:00:01',0,0,0,0),(1148,1,'GV-01','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1149,2,'GV-02','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1150,3,'GV-03','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1151,4,'GV-04','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1152,5,'GV-05','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1153,6,'GLI0132','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1154,7,'GV-06','2025-05-28',NULL,NULL,1,0,'2025-05-28 00:00:00','2025-05-28 00:00:00',0,0,0,0),(1155,1,'GV-01','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1156,2,'GV-02','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1157,3,'GV-03','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1158,4,'GV-04','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1159,5,'GV-05','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1160,6,'GLI0132','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1161,7,'GV-06','2025-05-29',NULL,NULL,1,0,'2025-05-29 00:00:00','2025-05-29 00:00:00',0,0,0,0),(1162,1,'GV-01','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1163,2,'GV-02','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1164,3,'GV-03','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1165,4,'GV-04','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1166,5,'GV-05','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1167,6,'GLI0132','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1168,7,'GV-06','2025-05-30',NULL,NULL,1,0,'2025-05-30 00:00:00','2025-05-30 00:00:00',0,0,0,0),(1169,1,'GV-01','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1170,2,'GV-02','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1171,3,'GV-03','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1172,4,'GV-04','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1173,5,'GV-05','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1174,6,'GLI0132','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1175,7,'GV-06','2025-05-31',NULL,NULL,1,0,'2025-05-31 00:00:01','2025-05-31 00:00:01',0,0,0,0),(1176,1,'GV-01','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1177,2,'GV-02','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1178,3,'GV-03','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1179,4,'GV-04','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1180,5,'GV-05','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1181,6,'GLI0132','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1182,7,'GV-06','2025-06-01',NULL,NULL,1,0,'2025-06-01 00:00:00','2025-06-01 00:00:00',0,0,0,0),(1183,1,'GV-01','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1184,2,'GV-02','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1185,3,'GV-03','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1186,4,'GV-04','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1187,5,'GV-05','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1188,6,'GLI0132','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1189,7,'GV-06','2025-06-02',NULL,NULL,1,0,'2025-06-02 00:00:00','2025-06-02 00:00:00',0,0,0,0),(1190,1,'GV-01','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1191,2,'GV-02','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1192,3,'GV-03','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1193,4,'GV-04','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1194,5,'GV-05','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1195,6,'GLI0132','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1196,7,'GV-06','2025-06-03',NULL,NULL,1,0,'2025-06-03 00:00:00','2025-06-03 00:00:00',0,0,0,0),(1197,1,'GV-01','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1198,2,'GV-02','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1199,3,'GV-03','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1200,4,'GV-04','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1201,5,'GV-05','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1202,6,'GLI0132','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1203,7,'GV-06','2025-06-04',NULL,NULL,1,0,'2025-06-04 00:00:00','2025-06-04 00:00:00',0,0,0,0),(1204,1,'GV-01','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1205,2,'GV-02','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1206,3,'GV-03','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1207,4,'GV-04','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1208,5,'GV-05','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1209,6,'GLI0132','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1210,7,'GV-06','2025-06-05',NULL,NULL,1,0,'2025-06-05 00:00:00','2025-06-05 00:00:00',0,0,0,0),(1211,1,'GV-01','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:01',0,0,0,0),(1212,2,'GV-02','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:01',0,0,0,0),(1213,3,'GV-03','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:01',0,0,0,0),(1214,4,'GV-04','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:01',0,0,0,0),(1215,5,'GV-05','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:02',0,0,0,0),(1216,6,'GLI0132','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:02',0,0,0,0),(1217,7,'GV-06','2025-06-06',NULL,NULL,1,0,'2025-06-06 00:00:00','2025-06-06 00:00:02',0,0,0,0),(1218,1,'GV-01','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:00',0,0,0,0),(1219,2,'GV-02','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:00',0,0,0,0),(1220,3,'GV-03','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:00',0,0,0,0),(1221,4,'GV-04','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:00',0,0,0,0),(1222,5,'GV-05','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:00',0,0,0,0),(1223,6,'GLI0132','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:00',0,0,0,0),(1224,7,'GV-06','2025-06-07',NULL,NULL,1,0,'2025-06-07 00:00:00','2025-06-07 00:00:01',0,0,0,0),(1225,1,'GV-01','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1226,2,'GV-02','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1227,3,'GV-03','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1228,4,'GV-04','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1229,5,'GV-05','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1230,6,'GLI0132','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1231,7,'GV-06','2025-06-08',NULL,NULL,1,0,'2025-06-08 00:00:00','2025-06-08 00:00:00',0,0,0,0),(1232,1,'GV-01','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:01',0,0,0,0),(1233,2,'GV-02','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:01',0,0,0,0),(1234,3,'GV-03','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:01',0,0,0,0),(1235,4,'GV-04','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:01',0,0,0,0),(1236,5,'GV-05','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:02',0,0,0,0),(1237,6,'GLI0132','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:03',0,0,0,0),(1238,7,'GV-06','2025-06-09',NULL,NULL,1,0,'2025-06-09 00:00:00','2025-06-09 00:00:04',0,0,0,0),(1239,1,'GV-01','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1240,2,'GV-02','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1241,3,'GV-03','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1242,4,'GV-04','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1243,5,'GV-05','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1244,6,'GLI0132','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1245,7,'GV-06','2025-06-10',NULL,NULL,1,0,'2025-06-10 00:00:00','2025-06-10 00:00:00',0,0,0,0),(1246,1,'GV-01','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1247,2,'GV-02','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1248,3,'GV-03','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1249,4,'GV-04','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1250,5,'GV-05','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1251,6,'GLI0132','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1252,7,'GV-06','2025-06-11',NULL,NULL,1,0,'2025-06-11 00:00:00','2025-06-11 00:00:00',0,0,0,0),(1253,1,'GV-01','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1254,2,'GV-02','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1255,3,'GV-03','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1256,4,'GV-04','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1257,5,'GV-05','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1258,6,'GLI0132','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1259,7,'GV-06','2025-06-12',NULL,NULL,1,0,'2025-06-12 00:00:00','2025-06-12 00:00:01',0,0,0,0),(1260,1,'GV-01','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1261,2,'GV-02','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1262,3,'GV-03','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1263,4,'GV-04','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1264,5,'GV-05','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1265,6,'GLI0132','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1266,7,'GV-06','2025-06-13',NULL,NULL,1,0,'2025-06-13 00:00:00','2025-06-13 00:00:00',0,0,0,0),(1267,1,'GV-01','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1268,2,'GV-02','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1269,3,'GV-03','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1270,4,'GV-04','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1271,5,'GV-05','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1272,6,'GLI0132','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1273,7,'GV-06','2025-06-14',NULL,NULL,1,0,'2025-06-14 00:00:00','2025-06-14 00:00:00',0,0,0,0),(1274,1,'GV-01','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1275,2,'GV-02','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1276,3,'GV-03','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1277,4,'GV-04','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1278,5,'GV-05','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1279,6,'GLI0132','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1280,7,'GV-06','2025-06-15',NULL,NULL,1,0,'2025-06-15 00:00:00','2025-06-15 00:00:00',0,0,0,0),(1281,1,'GV-01','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1282,2,'GV-02','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1283,3,'GV-03','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1284,4,'GV-04','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1285,5,'GV-05','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1286,6,'GLI0132','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1287,7,'GV-06','2025-06-16',NULL,NULL,1,0,'2025-06-16 00:00:00','2025-06-16 00:00:00',0,0,0,0),(1288,1,'GV-01','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:01',0,0,0,0),(1289,2,'GV-02','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:01',0,0,0,0),(1290,3,'GV-03','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:01',0,0,0,0),(1291,4,'GV-04','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:01',0,0,0,0),(1292,5,'GV-05','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:01',0,0,0,0),(1293,6,'GLI0132','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:01',0,0,0,0),(1294,7,'GV-06','2025-06-17',NULL,NULL,1,0,'2025-06-17 00:00:00','2025-06-17 00:00:02',0,0,0,0),(1295,1,'GV-01','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:00',0,0,0,0),(1296,2,'GV-02','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:01',0,0,0,0),(1297,3,'GV-03','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:01',0,0,0,0),(1298,4,'GV-04','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:01',0,0,0,0),(1299,5,'GV-05','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:01',0,0,0,0),(1300,6,'GLI0132','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:01',0,0,0,0),(1301,7,'GV-06','2025-06-18',NULL,NULL,1,0,'2025-06-18 00:00:00','2025-06-18 00:00:02',0,0,0,0),(1302,1,'GV-01','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1303,2,'GV-02','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1304,3,'GV-03','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1305,4,'GV-04','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1306,5,'GV-05','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1307,6,'GLI0132','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1308,7,'GV-06','2025-06-19',NULL,NULL,1,0,'2025-06-19 00:00:00','2025-06-19 00:00:00',0,0,0,0),(1309,1,'GV-01','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:01',0,0,0,0),(1310,2,'GV-02','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:01',0,0,0,0),(1311,3,'GV-03','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:01',0,0,0,0),(1312,4,'GV-04','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:01',0,0,0,0),(1313,5,'GV-05','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:01',0,0,0,0),(1314,6,'GLI0132','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:02',0,0,0,0),(1315,7,'GV-06','2025-06-20',NULL,NULL,1,0,'2025-06-20 00:00:00','2025-06-20 00:00:02',0,0,0,0),(1316,1,'GV-01','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:00',0,0,0,0),(1317,2,'GV-02','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:01',0,0,0,0),(1318,3,'GV-03','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:01',0,0,0,0),(1319,4,'GV-04','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:01',0,0,0,0),(1320,5,'GV-05','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:01',0,0,0,0),(1321,6,'GLI0132','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:01',0,0,0,0),(1322,7,'GV-06','2025-06-21',NULL,NULL,1,0,'2025-06-21 00:00:00','2025-06-21 00:00:01',0,0,0,0),(1323,1,'GV-01','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1324,2,'GV-02','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1325,3,'GV-03','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1326,4,'GV-04','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1327,5,'GV-05','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1328,6,'GLI0132','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1329,7,'GV-06','2025-06-22',NULL,NULL,1,0,'2025-06-22 00:00:00','2025-06-22 00:00:00',0,0,0,0),(1330,1,'GV-01','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1331,2,'GV-02','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1332,3,'GV-03','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1333,4,'GV-04','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1334,5,'GV-05','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1335,6,'GLI0132','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1336,7,'GV-06','2025-06-23',NULL,NULL,1,0,'2025-06-23 00:00:00','2025-06-23 00:00:00',0,0,0,0),(1337,1,'GV-01','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:00',0,0,0,0),(1338,2,'GV-02','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:00',0,0,0,0),(1339,3,'GV-03','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:01',0,0,0,0),(1340,4,'GV-04','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:01',0,0,0,0),(1341,5,'GV-05','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:01',0,0,0,0),(1342,6,'GLI0132','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:01',0,0,0,0),(1343,7,'GV-06','2025-06-24',NULL,NULL,1,0,'2025-06-24 00:00:00','2025-06-24 00:00:01',0,0,0,0),(1344,1,'GV-01','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1345,2,'GV-02','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1346,3,'GV-03','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1347,4,'GV-04','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1348,5,'GV-05','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1349,6,'GLI0132','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1350,7,'GV-06','2025-06-25',NULL,NULL,1,0,'2025-06-25 00:00:00','2025-06-25 00:00:00',0,0,0,0),(1351,1,'GV-01','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1352,2,'GV-02','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1353,3,'GV-03','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1354,4,'GV-04','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1355,5,'GV-05','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1356,6,'GLI0132','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1357,7,'GV-06','2025-06-26',NULL,NULL,1,0,'2025-06-26 00:00:00','2025-06-26 00:00:00',0,0,0,0),(1358,1,'GV-01','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:00',0,0,0,0),(1359,2,'GV-02','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:00',0,0,0,0),(1360,3,'GV-03','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:00',0,0,0,0),(1361,4,'GV-04','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:01',0,0,0,0),(1362,5,'GV-05','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:01',0,0,0,0),(1363,6,'GLI0132','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:01',0,0,0,0),(1364,7,'GV-06','2025-06-27',NULL,NULL,1,0,'2025-06-27 00:00:00','2025-06-27 00:00:01',0,0,0,0),(1365,1,'GV-01','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1366,2,'GV-02','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1367,3,'GV-03','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1368,4,'GV-04','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1369,5,'GV-05','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1370,6,'GLI0132','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1371,7,'GV-06','2025-06-28',NULL,NULL,1,0,'2025-06-28 00:00:00','2025-06-28 00:00:00',0,0,0,0),(1372,1,'GV-01','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1373,2,'GV-02','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1374,3,'GV-03','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1375,4,'GV-04','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1376,5,'GV-05','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1377,6,'GLI0132','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1378,7,'GV-06','2025-06-29',NULL,NULL,1,0,'2025-06-29 00:00:00','2025-06-29 00:00:00',0,0,0,0),(1379,1,'GV-01','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1380,2,'GV-02','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1381,3,'GV-03','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1382,4,'GV-04','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1383,5,'GV-05','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1384,6,'GLI0132','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1385,7,'GV-06','2025-06-30',NULL,NULL,1,0,'2025-06-30 00:00:00','2025-06-30 00:00:01',0,0,0,0),(1386,1,'GV-01','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1387,2,'GV-02','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1388,3,'GV-03','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1389,4,'GV-04','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1390,5,'GV-05','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1391,6,'GLI0132','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1392,7,'GV-06','2025-07-01',NULL,NULL,1,0,'2025-07-01 00:00:00','2025-07-01 00:00:01',0,0,0,0),(1393,1,'GV-01','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1394,2,'GV-02','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1395,3,'GV-03','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1396,4,'GV-04','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1397,5,'GV-05','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1398,6,'GLI0132','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1399,7,'GV-06','2025-07-02',NULL,NULL,1,0,'2025-07-02 00:00:00','2025-07-02 00:00:00',0,0,0,0),(1400,1,'GV-01','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1401,2,'GV-02','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1402,3,'GV-03','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1403,4,'GV-04','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1404,5,'GV-05','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1405,6,'GLI0132','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1406,7,'GV-06','2025-07-03',NULL,NULL,1,0,'2025-07-03 00:00:00','2025-07-03 00:00:00',0,0,0,0),(1407,1,'GV-01','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1408,2,'GV-02','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1409,3,'GV-03','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1410,4,'GV-04','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1411,5,'GV-05','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1412,6,'GLI0132','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1413,7,'GV-06','2025-07-04',NULL,NULL,1,0,'2025-07-04 00:00:00','2025-07-04 00:00:00',0,0,0,0),(1414,1,'GV-01','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0),(1415,2,'GV-02','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0),(1416,3,'GV-03','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0),(1417,4,'GV-04','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0),(1418,5,'GV-05','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0),(1419,6,'GLI0132','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0),(1420,7,'GV-06','2025-07-05',NULL,NULL,1,0,'2025-07-05 00:00:00','2025-07-05 00:00:00',0,0,0,0);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_policy`
--

DROP TABLE IF EXISTS `attendance_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` text NOT NULL,
  `attendance_cycle_start` int NOT NULL DEFAULT '1',
  `biometric` tinyint(1) DEFAULT '0',
  `web` tinyint(1) DEFAULT '0',
  `app` tinyint(1) DEFAULT '0',
  `manual` tinyint(1) DEFAULT '0',
  `half_day` tinyint(1) DEFAULT '0',
  `min_hours_for_half_day` float DEFAULT NULL,
  `display_overtime_hours` tinyint(1) DEFAULT '0',
  `display_deficit_hours` tinyint(1) DEFAULT '0',
  `display_late_mark` tinyint(1) DEFAULT '0',
  `display_average_working_hours` tinyint(1) DEFAULT '0',
  `display_present_number_of_days` tinyint(1) DEFAULT '0',
  `display_absent_number_of_days` tinyint(1) DEFAULT '0',
  `display_number_of_leaves_taken` tinyint(1) DEFAULT '0',
  `display_average_in_time` tinyint(1) DEFAULT '0',
  `display_average_out_time` tinyint(1) DEFAULT '0',
  `flexibility_hours` tinyint(1) DEFAULT '0',
  `call_out_regularisation` tinyint(1) DEFAULT '0',
  `round_off` tinyint(1) DEFAULT '0',
  `auto_approval_attendance_request` tinyint(1) DEFAULT '0',
  `regularisation_restriction` tinyint(1) DEFAULT '0',
  `regularisation_restriction_limit` int DEFAULT NULL,
  `regularisation_limit_for_month` int DEFAULT NULL,
  `bypass_regularisation_proxy` tinyint(1) DEFAULT '0',
  `location_based_restriction` tinyint(1) DEFAULT '0',
  `location_mandatory` tinyint(1) DEFAULT '0',
  `location` varchar(255) DEFAULT NULL,
  `distance_allowed` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `default_attendance_status` int NOT NULL DEFAULT '1',
  `mobile_app_restriction` tinyint(1) NOT NULL DEFAULT '0',
  `number_of_devices_allowed` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_policy`
--

LOCK TABLES `attendance_policy` WRITE;
/*!40000 ALTER TABLE `attendance_policy` DISABLE KEYS */;
INSERT INTO `attendance_policy` (`id`, `description`, `name`, `attendance_cycle_start`, `biometric`, `web`, `app`, `manual`, `half_day`, `min_hours_for_half_day`, `display_overtime_hours`, `display_deficit_hours`, `display_late_mark`, `display_average_working_hours`, `display_present_number_of_days`, `display_absent_number_of_days`, `display_number_of_leaves_taken`, `display_average_in_time`, `display_average_out_time`, `flexibility_hours`, `call_out_regularisation`, `round_off`, `auto_approval_attendance_request`, `regularisation_restriction`, `regularisation_restriction_limit`, `regularisation_limit_for_month`, `bypass_regularisation_proxy`, `location_based_restriction`, `location_mandatory`, `location`, `distance_allowed`, `created_at`, `updated_at`, `default_attendance_status`, `mobile_app_restriction`, `number_of_devices_allowed`) VALUES (1,'Standard Policy for GV','Glocalview Standard',1,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,NULL,NULL,'2021-03-21 19:53:50','2024-11-13 11:26:22',1,0,NULL);
/*!40000 ALTER TABLE `attendance_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_status`
--

DROP TABLE IF EXISTS `attendance_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_status`
--

LOCK TABLES `attendance_status` WRITE;
/*!40000 ALTER TABLE `attendance_status` DISABLE KEYS */;
INSERT INTO `attendance_status` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'absent',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'half day',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'present',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'weekday off',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'holiday',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'leave',0,'2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `attendance_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_leave_configuration`
--

DROP TABLE IF EXISTS `base_leave_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_leave_configuration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(255) NOT NULL,
  `policy_description` text,
  `leave_calendar_from` int NOT NULL,
  `proxy_leave_application` tinyint(1) DEFAULT '0',
  `leave_request_status` tinyint(1) DEFAULT '0',
  `leave_balance_status` tinyint(1) DEFAULT '0',
  `contact_number_allowed` tinyint(1) DEFAULT '0',
  `contact_number_mandatory` tinyint(1) DEFAULT '0',
  `reason_for_leave` tinyint(1) DEFAULT '0',
  `reason_for_leave_mandatory` tinyint(1) DEFAULT '0',
  `notify_peer` tinyint(1) DEFAULT '0',
  `leave_rejection_reason` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `custom_month` int DEFAULT NULL,
  `notify_peer_mandatory` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_leave_configuration`
--

LOCK TABLES `base_leave_configuration` WRITE;
/*!40000 ALTER TABLE `base_leave_configuration` DISABLE KEYS */;
INSERT INTO `base_leave_configuration` (`id`, `policy_name`, `policy_description`, `leave_calendar_from`, `proxy_leave_application`, `leave_request_status`, `leave_balance_status`, `contact_number_allowed`, `contact_number_mandatory`, `reason_for_leave`, `reason_for_leave_mandatory`, `notify_peer`, `leave_rejection_reason`, `is_deleted`, `created_at`, `updated_at`, `custom_month`, `notify_peer_mandatory`) VALUES (1,'GV Standard Policy','Initial Testing',1,0,1,1,1,1,1,1,1,1,0,'2024-08-27 13:14:23','2024-08-27 13:14:23',NULL,0);
/*!40000 ALTER TABLE `base_leave_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calculation_parameters`
--

DROP TABLE IF EXISTS `calculation_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calculation_parameters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calculation_parameters`
--

LOCK TABLES `calculation_parameters` WRITE;
/*!40000 ALTER TABLE `calculation_parameters` DISABLE KEYS */;
INSERT INTO `calculation_parameters` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Fixed','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Percentage','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `calculation_parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` text NOT NULL,
  `company_email` text NOT NULL,
  `company_mobile` bigint NOT NULL,
  `teamsize` int NOT NULL,
  `industry_id` text NOT NULL,
  `domain` char(255) NOT NULL,
  `pan` text NOT NULL,
  `gst` text NOT NULL,
  `company_prefix` text NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `domain` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` (`id`, `company_name`, `company_email`, `company_mobile`, `teamsize`, `industry_id`, `domain`, `pan`, `gst`, `company_prefix`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'Glocaliew','gvnoida@gmail.com',9773914237,100,'1','glocalview','UV2KRE6BTS','34CIPPS5925M1ZF','GV',0,'2023-03-23 16:00:00','2023-03-23 16:00:00');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_address`
--

DROP TABLE IF EXISTS `company_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_present_address` text NOT NULL,
  `company_present_pincode` int NOT NULL,
  `company_present_city` text NOT NULL,
  `company_present_state` text NOT NULL,
  `company_present_country_id` int NOT NULL,
  `company_present_mobile` varchar(255) NOT NULL,
  `company_permanent_address` text NOT NULL,
  `company_permanent_pincode` int NOT NULL,
  `company_permanent_city` text NOT NULL,
  `company_permanent_state` text NOT NULL,
  `company_permanent_country_id` int NOT NULL,
  `company_permanent_mobile` varchar(255) NOT NULL,
  `company_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `company_address_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_address`
--

LOCK TABLES `company_address` WRITE;
/*!40000 ALTER TABLE `company_address` DISABLE KEYS */;
INSERT INTO `company_address` (`id`, `company_present_address`, `company_present_pincode`, `company_present_city`, `company_present_state`, `company_present_country_id`, `company_present_mobile`, `company_permanent_address`, `company_permanent_pincode`, `company_permanent_city`, `company_permanent_state`, `company_permanent_country_id`, `company_permanent_mobile`, `company_id`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'A-63, Sector-67, Noida',201301,'Noida','Uttar Pradesh',101,'9773914237','A-63, Sector-67, Noida',201301,'Noida','Uttar Pradesh',101,'9773914237',1,0,'2021-03-21 19:53:50','2021-03-21 19:53:50');
/*!40000 ALTER TABLE `company_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` (`id`, `name`, `code`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'Afghanistan','AF',0,NULL,NULL),(2,'Åland Islands','AX',0,NULL,NULL),(3,'Albania','AL',0,NULL,NULL),(4,'Algeria','DZ',0,NULL,NULL),(5,'American Samoa','AS',0,NULL,NULL),(6,'AndorrA','AD',0,NULL,NULL),(7,'Angola','AO',0,NULL,NULL),(8,'Anguilla','AI',0,NULL,NULL),(9,'Antarctica','AQ',0,NULL,NULL),(10,'Antigua and Barbuda','AG',0,NULL,NULL),(11,'Argentina','AR',0,NULL,NULL),(12,'Armenia','AM',0,NULL,NULL),(13,'Aruba','AW',0,NULL,NULL),(14,'Australia','AU',0,NULL,NULL),(15,'Austria','AT',0,NULL,NULL),(16,'Azerbaijan','AZ',0,NULL,NULL),(17,'Bahamas','BS',0,NULL,NULL),(18,'Bahrain','BH',0,NULL,NULL),(19,'Bangladesh','BD',0,NULL,NULL),(20,'Barbados','BB',0,NULL,NULL),(21,'Belarus','BY',0,NULL,NULL),(22,'Belgium','BE',0,NULL,NULL),(23,'Belize','BZ',0,NULL,NULL),(24,'Benin','BJ',0,NULL,NULL),(25,'Bermuda','BM',0,NULL,NULL),(26,'Bhutan','BT',0,NULL,NULL),(27,'Bolivia','BO',0,NULL,NULL),(28,'Bosnia and Herzegovina','BA',0,NULL,NULL),(29,'Botswana','BW',0,NULL,NULL),(30,'Bouvet Island','BV',0,NULL,NULL),(31,'Brazil','BR',0,NULL,NULL),(32,'British Indian Ocean Territory','IO',0,NULL,NULL),(33,'Brunei Darussalam','BN',0,NULL,NULL),(34,'Bulgaria','BG',0,NULL,NULL),(35,'Burkina Faso','BF',0,NULL,NULL),(36,'Burundi','BI',0,NULL,NULL),(37,'Cambodia','KH',0,NULL,NULL),(38,'Cameroon','CM',0,NULL,NULL),(39,'Canada','CA',0,NULL,NULL),(40,'Cape Verde','CV',0,NULL,NULL),(41,'Cayman Islands','KY',0,NULL,NULL),(42,'Central African Republic','CF',0,NULL,NULL),(43,'Chad','TD',0,NULL,NULL),(44,'Chile','CL',0,NULL,NULL),(45,'China','CN',0,NULL,NULL),(46,'Christmas Island','CX',0,NULL,NULL),(47,'Cocos (Keeling) Islands','CC',0,NULL,NULL),(48,'Colombia','CO',0,NULL,NULL),(49,'Comoros','KM',0,NULL,NULL),(50,'Congo','CG',0,NULL,NULL),(51,'Congo, The Democratic Republic of the','CD',0,NULL,NULL),(52,'Cook Islands','CK',0,NULL,NULL),(53,'Costa Rica','CR',0,NULL,NULL),(54,'Cote D\'Ivoire','CI',0,NULL,NULL),(55,'Croatia','HR',0,NULL,NULL),(56,'Cuba','CU',0,NULL,NULL),(57,'Cyprus','CY',0,NULL,NULL),(58,'Czech Republic','CZ',0,NULL,NULL),(59,'Denmark','DK',0,NULL,NULL),(60,'Djibouti','DJ',0,NULL,NULL),(61,'Dominica','DM',0,NULL,NULL),(62,'Dominican Republic','DO',0,NULL,NULL),(63,'Ecuador','EC',0,NULL,NULL),(64,'Egypt','EG',0,NULL,NULL),(65,'El Salvador','SV',0,NULL,NULL),(66,'Equatorial Guinea','GQ',0,NULL,NULL),(67,'Eritrea','ER',0,NULL,NULL),(68,'Estonia','EE',0,NULL,NULL),(69,'Ethiopia','ET',0,NULL,NULL),(70,'Falkland Islands (Malvinas)','FK',0,NULL,NULL),(71,'Faroe Islands','FO',0,NULL,NULL),(72,'Fiji','FJ',0,NULL,NULL),(73,'Finland','FI',0,NULL,NULL),(74,'France','FR',0,NULL,NULL),(75,'French Guiana','GF',0,NULL,NULL),(76,'French Polynesia','PF',0,NULL,NULL),(77,'French Southern Territories','TF',0,NULL,NULL),(78,'Gabon','GA',0,NULL,NULL),(79,'Gambia','GM',0,NULL,NULL),(80,'Georgia','GE',0,NULL,NULL),(81,'Germany','DE',0,NULL,NULL),(82,'Ghana','GH',0,NULL,NULL),(83,'Gibraltar','GI',0,NULL,NULL),(84,'Greece','GR',0,NULL,NULL),(85,'Greenland','GL',0,NULL,NULL),(86,'Grenada','GD',0,NULL,NULL),(87,'Guadeloupe','GP',0,NULL,NULL),(88,'Guam','GU',0,NULL,NULL),(89,'Guatemala','GT',0,NULL,NULL),(90,'Guernsey','GG',0,NULL,NULL),(91,'Guinea','GN',0,NULL,NULL),(92,'Guinea-Bissau','GW',0,NULL,NULL),(93,'Guyana','GY',0,NULL,NULL),(94,'Haiti','HT',0,NULL,NULL),(95,'Heard Island and Mcdonald Islands','HM',0,NULL,NULL),(96,'Holy See (Vatican City State)','VA',0,NULL,NULL),(97,'Honduras','HN',0,NULL,NULL),(98,'Hong Kong','HK',0,NULL,NULL),(99,'Hungary','HU',0,NULL,NULL),(100,'Iceland','IS',0,NULL,NULL),(101,'India','IN',0,NULL,NULL),(102,'Indonesia','ID',0,NULL,NULL),(103,'Iran, Islamic Republic Of','IR',0,NULL,NULL),(104,'Iraq','IQ',0,NULL,NULL),(105,'Ireland','IE',0,NULL,NULL),(106,'Isle of Man','IM',0,NULL,NULL),(107,'Israel','IL',0,NULL,NULL),(108,'Italy','IT',0,NULL,NULL),(109,'Jamaica','JM',0,NULL,NULL),(110,'Japan','JP',0,NULL,NULL),(111,'Jersey','JE',0,NULL,NULL),(112,'Jordan','JO',0,NULL,NULL),(113,'Kazakhstan','KZ',0,NULL,NULL),(114,'Kenya','KE',0,NULL,NULL),(115,'Kiribati','KI',0,NULL,NULL),(116,'Korea, Democratic People\'S Republic of','KP',0,NULL,NULL),(117,'Korea, Republic of','KR',0,NULL,NULL),(118,'Kuwait','KW',0,NULL,NULL),(119,'Kyrgyzstan','KG',0,NULL,NULL),(120,'Lao People\'S Democratic Republic','LA',0,NULL,NULL),(121,'Latvia','LV',0,NULL,NULL),(122,'Lebanon','LB',0,NULL,NULL),(123,'Lesotho','LS',0,NULL,NULL),(124,'Liberia','LR',0,NULL,NULL),(125,'Libyan Arab Jamahiriya','LY',0,NULL,NULL),(126,'Liechtenstein','LI',0,NULL,NULL),(127,'Lithuania','LT',0,NULL,NULL),(128,'Luxembourg','LU',0,NULL,NULL),(129,'Macao','MO',0,NULL,NULL),(130,'Macedonia, The Former Yugoslav Republic of','MK',0,NULL,NULL),(131,'Madagascar','MG',0,NULL,NULL),(132,'Malawi','MW',0,NULL,NULL),(133,'Malaysia','MY',0,NULL,NULL),(134,'Maldives','MV',0,NULL,NULL),(135,'Mali','ML',0,NULL,NULL),(136,'Malta','MT',0,NULL,NULL),(137,'Marshall Islands','MH',0,NULL,NULL),(138,'Martinique','MQ',0,NULL,NULL),(139,'Mauritania','MR',0,NULL,NULL),(140,'Mauritius','MU',0,NULL,NULL),(141,'Mayotte','YT',0,NULL,NULL),(142,'Mexico','MX',0,NULL,NULL),(143,'Micronesia, Federated States of','FM',0,NULL,NULL),(144,'Moldova, Republic of','MD',0,NULL,NULL),(145,'Monaco','MC',0,NULL,NULL),(146,'Mongolia','MN',0,NULL,NULL),(147,'Montserrat','MS',0,NULL,NULL),(148,'Morocco','MA',0,NULL,NULL),(149,'Mozambique','MZ',0,NULL,NULL),(150,'Myanmar','MM',0,NULL,NULL),(151,'Namibia','NA',0,NULL,NULL),(152,'Nauru','NR',0,NULL,NULL),(153,'Nepal','NP',0,NULL,NULL),(154,'Netherlands','NL',0,NULL,NULL),(155,'Netherlands Antilles','AN',0,NULL,NULL),(156,'New Caledonia','NC',0,NULL,NULL),(157,'New Zealand','NZ',0,NULL,NULL),(158,'Nicaragua','NI',0,NULL,NULL),(159,'Niger','NE',0,NULL,NULL),(160,'Nigeria','NG',0,NULL,NULL),(161,'Niue','NU',0,NULL,NULL),(162,'Norfolk Island','NF',0,NULL,NULL),(163,'Northern Mariana Islands','MP',0,NULL,NULL),(164,'Norway','NO',0,NULL,NULL),(165,'Oman','OM',0,NULL,NULL),(166,'Pakistan','PK',0,NULL,NULL),(167,'Palau','PW',0,NULL,NULL),(168,'Palestinian Territory, Occupied','PS',0,NULL,NULL),(169,'Panama','PA',0,NULL,NULL),(170,'Papua New Guinea','PG',0,NULL,NULL),(171,'Paraguay','PY',0,NULL,NULL),(172,'Peru','PE',0,NULL,NULL),(173,'Philippines','PH',0,NULL,NULL),(174,'Pitcairn','PN',0,NULL,NULL),(175,'Poland','PL',0,NULL,NULL),(176,'Portugal','PT',0,NULL,NULL),(177,'Puerto Rico','PR',0,NULL,NULL),(178,'Qatar','QA',0,NULL,NULL),(179,'Reunion','RE',0,NULL,NULL),(180,'Romania','RO',0,NULL,NULL),(181,'Russian Federation','RU',0,NULL,NULL),(182,'RWANDA','RW',0,NULL,NULL),(183,'Saint Helena','SH',0,NULL,NULL),(184,'Saint Kitts and Nevis','KN',0,NULL,NULL),(185,'Saint Lucia','LC',0,NULL,NULL),(186,'Saint Pierre and Miquelon','PM',0,NULL,NULL),(187,'Saint Vincent and the Grenadines','VC',0,NULL,NULL),(188,'Samoa','WS',0,NULL,NULL),(189,'San Marino','SM',0,NULL,NULL),(190,'Sao Tome and Principe','ST',0,NULL,NULL),(191,'Saudi Arabia','SA',0,NULL,NULL),(192,'Senegal','SN',0,NULL,NULL),(193,'Serbia and Montenegro','CS',0,NULL,NULL),(194,'Seychelles','SC',0,NULL,NULL),(195,'Sierra Leone','SL',0,NULL,NULL),(196,'Singapore','SG',0,NULL,NULL),(197,'Slovakia','SK',0,NULL,NULL),(198,'Slovenia','SI',0,NULL,NULL),(199,'Solomon Islands','SB',0,NULL,NULL),(200,'Somalia','SO',0,NULL,NULL),(201,'South Africa','ZA',0,NULL,NULL),(202,'South Georgia and the South Sandwich Islands','GS',0,NULL,NULL),(203,'Spain','ES',0,NULL,NULL),(204,'Sri Lanka','LK',0,NULL,NULL),(205,'Sudan','SD',0,NULL,NULL),(206,'Suriname','SR',0,NULL,NULL),(207,'Svalbard and Jan Mayen','SJ',0,NULL,NULL),(208,'Swaziland','SZ',0,NULL,NULL),(209,'Sweden','SE',0,NULL,NULL),(210,'Switzerland','CH',0,NULL,NULL),(211,'Syrian Arab Republic','SY',0,NULL,NULL),(212,'Taiwan, Province of China','TW',0,NULL,NULL),(213,'Tajikistan','TJ',0,NULL,NULL),(214,'Tanzania, United Republic of','TZ',0,NULL,NULL),(215,'Thailand','TH',0,NULL,NULL),(216,'Timor-Leste','TL',0,NULL,NULL),(217,'Togo','TG',0,NULL,NULL),(218,'Tokelau','TK',0,NULL,NULL),(219,'Tonga','TO',0,NULL,NULL),(220,'Trinidad and Tobago','TT',0,NULL,NULL),(221,'Tunisia','TN',0,NULL,NULL),(222,'Turkey','TR',0,NULL,NULL),(223,'Turkmenistan','TM',0,NULL,NULL),(224,'Turks and Caicos Islands','TC',0,NULL,NULL),(225,'Tuvalu','TV',0,NULL,NULL),(226,'Uganda','UG',0,NULL,NULL),(227,'Ukraine','UA',0,NULL,NULL),(228,'United Arab Emirates','AE',0,NULL,NULL),(229,'United Kingdom','GB',0,NULL,NULL),(230,'United States','US',0,NULL,NULL),(231,'United States Minor Outlying Islands','UM',0,NULL,NULL),(232,'Uruguay','UY',0,NULL,NULL),(233,'Uzbekistan','UZ',0,NULL,NULL),(234,'Vanuatu','VU',0,NULL,NULL),(235,'Venezuela','VE',0,NULL,NULL),(236,'Viet Nam','VN',0,NULL,NULL),(237,'Virgin Islands, British','VG',0,NULL,NULL),(238,'Virgin Islands, U.S.','VI',0,NULL,NULL),(239,'Wallis and Futuna','WF',0,NULL,NULL),(240,'Western Sahara','EH',0,NULL,NULL),(241,'Yemen','YE',0,NULL,NULL),(242,'Zambia','ZM',0,NULL,NULL),(243,'Zimbabwe','ZW',0,NULL,NULL);
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_holiday`
--

DROP TABLE IF EXISTS `custom_holiday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_holiday` (
  `id` int NOT NULL AUTO_INCREMENT,
  `holiday_calendar_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `holiday_calendar_id` (`holiday_calendar_id`),
  CONSTRAINT `custom_holiday_ibfk_1` FOREIGN KEY (`holiday_calendar_id`) REFERENCES `holiday_calendar` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_holiday`
--

LOCK TABLES `custom_holiday` WRITE;
/*!40000 ALTER TABLE `custom_holiday` DISABLE KEYS */;
/*!40000 ALTER TABLE `custom_holiday` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day_of_month`
--

DROP TABLE IF EXISTS `day_of_month`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `day_of_month` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day_of_month`
--

LOCK TABLES `day_of_month` WRITE;
/*!40000 ALTER TABLE `day_of_month` DISABLE KEYS */;
INSERT INTO `day_of_month` (`id`, `day`, `created_at`, `updated_at`) VALUES (1,'1','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'2','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'3','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'4','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'5','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'6','2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'7','2024-08-27 13:14:23','2024-08-27 13:14:23'),(8,'8','2024-08-27 13:14:23','2024-08-27 13:14:23'),(9,'9','2024-08-27 13:14:23','2024-08-27 13:14:23'),(10,'10','2024-08-27 13:14:23','2024-08-27 13:14:23'),(11,'11','2024-08-27 13:14:23','2024-08-27 13:14:23'),(12,'12','2024-08-27 13:14:23','2024-08-27 13:14:23'),(13,'13','2024-08-27 13:14:23','2024-08-27 13:14:23'),(14,'14','2024-08-27 13:14:23','2024-08-27 13:14:23'),(15,'15','2024-08-27 13:14:23','2024-08-27 13:14:23'),(16,'16','2024-08-27 13:14:23','2024-08-27 13:14:23'),(17,'17','2024-08-27 13:14:23','2024-08-27 13:14:23'),(18,'18','2024-08-27 13:14:23','2024-08-27 13:14:23'),(19,'19','2024-08-27 13:14:23','2024-08-27 13:14:23'),(20,'20','2024-08-27 13:14:23','2024-08-27 13:14:23'),(21,'21','2024-08-27 13:14:23','2024-08-27 13:14:23'),(22,'22','2024-08-27 13:14:23','2024-08-27 13:14:23'),(23,'23','2024-08-27 13:14:23','2024-08-27 13:14:23'),(24,'24','2024-08-27 13:14:23','2024-08-27 13:14:23'),(25,'25','2024-08-27 13:14:23','2024-08-27 13:14:23'),(26,'26','2024-08-27 13:14:23','2024-08-27 13:14:23'),(27,'27','2024-08-27 13:14:23','2024-08-27 13:14:23'),(28,'28','2024-08-27 13:14:23','2024-08-27 13:14:23'),(29,'Last Day','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `day_of_month` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day_type`
--

DROP TABLE IF EXISTS `day_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `day_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day_type`
--

LOCK TABLES `day_type` WRITE;
/*!40000 ALTER TABLE `day_type` DISABLE KEYS */;
INSERT INTO `day_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Half Day','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Full Day','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `day_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `display_rules`
--

DROP TABLE IF EXISTS `display_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `display_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `display_rules`
--

LOCK TABLES `display_rules` WRITE;
/*!40000 ALTER TABLE `display_rules` DISABLE KEYS */;
INSERT INTO `display_rules` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'overtime hours',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'deficit hours',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'late mark',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'average working hour',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'present no. of days',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'absent no. of days',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'no. of leaves taken',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(8,'average in time',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(9,'average out time',0,'2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `display_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `division`
--

DROP TABLE IF EXISTS `division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `division` (
  `id` int NOT NULL AUTO_INCREMENT,
  `division_name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `system_generated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `division`
--

LOCK TABLES `division` WRITE;
/*!40000 ALTER TABLE `division` DISABLE KEYS */;
INSERT INTO `division` (`id`, `division_name`, `created_at`, `updated_at`, `system_generated`) VALUES (1,'Designation','2024-08-27 13:14:23','2024-08-27 13:14:23',1),(2,'Department','2024-08-27 13:14:23','2024-08-27 13:14:23',1);
/*!40000 ALTER TABLE `division` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `division_units`
--

DROP TABLE IF EXISTS `division_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `division_units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(255) NOT NULL,
  `division_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `system_generated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `division_units`
--

LOCK TABLES `division_units` WRITE;
/*!40000 ALTER TABLE `division_units` DISABLE KEYS */;
INSERT INTO `division_units` (`id`, `unit_name`, `division_id`, `created_at`, `updated_at`, `system_generated`) VALUES (1,'HR',2,'2024-08-27 13:14:23','2024-08-27 13:14:23',1),(2,'IT',2,'2024-08-27 13:14:23',NULL,1),(3,'Marketing & Sales',2,'2024-08-27 13:14:23','2024-08-27 13:14:23',1),(4,'Finance',2,'2024-08-27 13:14:23','2024-08-27 13:14:23',1),(5,'Operations',2,'2024-08-27 13:14:23','2024-08-27 13:14:23',1);
/*!40000 ALTER TABLE `division_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `public_url` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_file` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `degree_id` int NOT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `field_of_study` varchar(255) DEFAULT NULL,
  `year_of_completion` int NOT NULL,
  `percentage` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `degree_id` (`degree_id`),
  CONSTRAINT `education_ibfk_1` FOREIGN KEY (`degree_id`) REFERENCES `education_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education_type`
--

DROP TABLE IF EXISTS `education_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education_type`
--

LOCK TABLES `education_type` WRITE;
/*!40000 ALTER TABLE `education_type` DISABLE KEYS */;
INSERT INTO `education_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Graduation','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Post-graduation','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Diploma','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'12th','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'10th','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'Certification','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `education_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_address`
--

DROP TABLE IF EXISTS `employee_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_present_address` text NOT NULL,
  `employee_present_pincode` int NOT NULL,
  `employee_present_city` text NOT NULL,
  `employee_present_state` text NOT NULL,
  `employee_present_country_id` int NOT NULL,
  `employee_present_mobile` varchar(255) NOT NULL,
  `employee_permanent_address` text NOT NULL,
  `employee_permanent_pincode` int NOT NULL,
  `employee_permanent_city` text NOT NULL,
  `employee_permanent_state` text NOT NULL,
  `employee_permanent_country_id` int NOT NULL,
  `employee_permanent_mobile` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `employee_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_address`
--

LOCK TABLES `employee_address` WRITE;
/*!40000 ALTER TABLE `employee_address` DISABLE KEYS */;
INSERT INTO `employee_address` (`id`, `employee_present_address`, `employee_present_pincode`, `employee_present_city`, `employee_present_state`, `employee_present_country_id`, `employee_present_mobile`, `employee_permanent_address`, `employee_permanent_pincode`, `employee_permanent_city`, `employee_permanent_state`, `employee_permanent_country_id`, `employee_permanent_mobile`, `user_id`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'C-13, Sector-13, Noida',201301,'Noida','Uttar Pradesh',101,'9773914237','C-13, Sector-13, Noida',201301,'Noida','Uttar Pradesh',101,'9773914237',1,0,'2021-03-21 19:53:50','2021-03-21 19:53:50');
/*!40000 ALTER TABLE `employee_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employment_type`
--

DROP TABLE IF EXISTS `employment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employment_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employment_type`
--

LOCK TABLES `employment_type` WRITE;
/*!40000 ALTER TABLE `employment_type` DISABLE KEYS */;
INSERT INTO `employment_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Full-time','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Part-time','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Contractual','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'Commission-based','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'Traineeship','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'Probation','2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'Internship','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `employment_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_purpuse`
--

DROP TABLE IF EXISTS `expense_purpuse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_purpuse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_purpuse`
--

LOCK TABLES `expense_purpuse` WRITE;
/*!40000 ALTER TABLE `expense_purpuse` DISABLE KEYS */;
INSERT INTO `expense_purpuse` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Client Meeting','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Service','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Other','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `expense_purpuse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_request`
--

DROP TABLE IF EXISTS `expense_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `reporting_manager_id` int NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `priority` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `reporting_manager_id` (`reporting_manager_id`),
  KEY `status` (`status`),
  CONSTRAINT `expense_request_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`id`),
  CONSTRAINT `expense_request_ibfk_2` FOREIGN KEY (`reporting_manager_id`) REFERENCES `reporting_managers` (`id`),
  CONSTRAINT `expense_request_ibfk_3` FOREIGN KEY (`status`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_request`
--

LOCK TABLES `expense_request` WRITE;
/*!40000 ALTER TABLE `expense_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `expense_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_request_history`
--

DROP TABLE IF EXISTS `expense_request_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_request_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_record_id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `status_before` int NOT NULL,
  `status_after` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `expense_record_id` (`expense_record_id`),
  KEY `user_id` (`user_id`),
  KEY `status_before` (`status_before`),
  KEY `status_after` (`status_after`),
  CONSTRAINT `expense_request_history_ibfk_1` FOREIGN KEY (`expense_record_id`) REFERENCES `expenses` (`id`),
  CONSTRAINT `expense_request_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `expense_request_history_ibfk_3` FOREIGN KEY (`status_before`) REFERENCES `approval_status` (`id`),
  CONSTRAINT `expense_request_history_ibfk_4` FOREIGN KEY (`status_after`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_request_history`
--

LOCK TABLES `expense_request_history` WRITE;
/*!40000 ALTER TABLE `expense_request_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `expense_request_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `status_id` int NOT NULL,
  `purpose_id` int NOT NULL,
  `transaction_date` date NOT NULL,
  `billing_status` tinyint(1) NOT NULL DEFAULT '0',
  `bill_no` varchar(255) DEFAULT NULL,
  `from_location` varchar(255) DEFAULT NULL,
  `to_location` varchar(255) DEFAULT NULL,
  `from_latitude` float DEFAULT NULL,
  `from_longitude` float DEFAULT NULL,
  `to_latitude` float DEFAULT NULL,
  `to_longitude` float DEFAULT NULL,
  `total_distance` float DEFAULT NULL,
  `merchant_name` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `purpose_text` varchar(255) DEFAULT NULL,
  `supporting_doc_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `stay_from_date` date DEFAULT NULL,
  `stay_to_date` date DEFAULT NULL,
  `document_id` int DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  KEY `status_id` (`status_id`),
  KEY `purpose_id` (`purpose_id`),
  KEY `expenses_document_id_foreign_idx` (`document_id`),
  CONSTRAINT `expenses_document_id_foreign_idx` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `expenses_categories` (`id`),
  CONSTRAINT `expenses_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `expenses_approval_status` (`id`),
  CONSTRAINT `expenses_ibfk_4` FOREIGN KEY (`purpose_id`) REFERENCES `expense_purpuse` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses_approval_status`
--

DROP TABLE IF EXISTS `expenses_approval_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses_approval_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `border_hex_color` varchar(255) NOT NULL,
  `button_hex_color` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses_approval_status`
--

LOCK TABLES `expenses_approval_status` WRITE;
/*!40000 ALTER TABLE `expenses_approval_status` DISABLE KEYS */;
INSERT INTO `expenses_approval_status` (`id`, `name`, `created_at`, `updated_at`, `border_hex_color`, `button_hex_color`) VALUES (1,'Draft','2024-08-27 13:14:23','2024-08-27 13:14:23','#CDCDCD','#FAFAFA'),(2,'Pending','2024-08-27 13:14:23','2024-08-27 13:14:23','#F6BB42','#FFF9ED'),(3,'Approved','2024-08-27 13:14:23','2024-08-27 13:14:23','#00B087','#E6F8F3'),(4,'Cancelled','2024-08-27 13:14:23','2024-08-27 13:14:23','#D85A19','#FCEFE8'),(5,'Rejected','2024-08-27 13:14:23','2024-08-27 13:14:23','#FF684F','#FFF0EE');
/*!40000 ALTER TABLE `expenses_approval_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses_categories`
--

DROP TABLE IF EXISTS `expenses_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `expense_category_form_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `expense_category_form_id` (`expense_category_form_id`),
  CONSTRAINT `expenses_categories_ibfk_1` FOREIGN KEY (`expense_category_form_id`) REFERENCES `expenses_categories_forms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses_categories`
--

LOCK TABLES `expenses_categories` WRITE;
/*!40000 ALTER TABLE `expenses_categories` DISABLE KEYS */;
INSERT INTO `expenses_categories` (`id`, `category_name`, `expense_category_form_id`) VALUES (1,'Stay',3),(2,'Food',2),(3,'Travel',1),(4,'Good & Services',4),(5,'Other',4);
/*!40000 ALTER TABLE `expenses_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses_categories_forms`
--

DROP TABLE IF EXISTS `expenses_categories_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses_categories_forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_form_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses_categories_forms`
--

LOCK TABLES `expenses_categories_forms` WRITE;
/*!40000 ALTER TABLE `expenses_categories_forms` DISABLE KEYS */;
INSERT INTO `expenses_categories_forms` (`id`, `category_form_name`) VALUES (1,'Travel Form'),(2,'Food Form'),(3,'Stay Form'),(4,'Other Form');
/*!40000 ALTER TABLE `expenses_categories_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `employment_type_id` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `address` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `employment_type_id` (`employment_type_id`),
  CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `experience_ibfk_2` FOREIGN KEY (`employment_type_id`) REFERENCES `employment_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family_member`
--

DROP TABLE IF EXISTS `family_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `dob` datetime NOT NULL,
  `relation_id` int NOT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `relation_id` (`relation_id`),
  CONSTRAINT `family_member_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `family_member_ibfk_2` FOREIGN KEY (`relation_id`) REFERENCES `relation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family_member`
--

LOCK TABLES `family_member` WRITE;
/*!40000 ALTER TABLE `family_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `family_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frequency`
--

DROP TABLE IF EXISTS `frequency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frequency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frequency`
--

LOCK TABLES `frequency` WRITE;
/*!40000 ALTER TABLE `frequency` DISABLE KEYS */;
INSERT INTO `frequency` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Daily','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Weekly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Monthly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'Quaterly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'Half-Yearly','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'Anually','2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'Custom','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `frequency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
INSERT INTO `gender` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Male','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Female','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Others','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `half_day_type`
--

DROP TABLE IF EXISTS `half_day_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `half_day_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `half_day_type`
--

LOCK TABLES `half_day_type` WRITE;
/*!40000 ALTER TABLE `half_day_type` DISABLE KEYS */;
INSERT INTO `half_day_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'First Half','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Second Half','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `half_day_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_calendar`
--

DROP TABLE IF EXISTS `holiday_calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_calendar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_calendar`
--

LOCK TABLES `holiday_calendar` WRITE;
/*!40000 ALTER TABLE `holiday_calendar` DISABLE KEYS */;
INSERT INTO `holiday_calendar` (`id`, `name`, `year`, `created_at`, `updated_at`) VALUES (1,'Standard Holiday Calendar','2023','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `holiday_calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_calendar_association`
--

DROP TABLE IF EXISTS `holiday_calendar_association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_calendar_association` (
  `id` int NOT NULL AUTO_INCREMENT,
  `holiday_calendar_id` int NOT NULL,
  `holiday_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `holiday_calendar_id` (`holiday_calendar_id`),
  KEY `holiday_id` (`holiday_id`),
  CONSTRAINT `holiday_calendar_association_ibfk_1` FOREIGN KEY (`holiday_calendar_id`) REFERENCES `holiday_calendar` (`id`),
  CONSTRAINT `holiday_calendar_association_ibfk_2` FOREIGN KEY (`holiday_id`) REFERENCES `holiday_database` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_calendar_association`
--

LOCK TABLES `holiday_calendar_association` WRITE;
/*!40000 ALTER TABLE `holiday_calendar_association` DISABLE KEYS */;
/*!40000 ALTER TABLE `holiday_calendar_association` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_database`
--

DROP TABLE IF EXISTS `holiday_database`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_database` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `custom_holiday` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_database`
--

LOCK TABLES `holiday_database` WRITE;
/*!40000 ALTER TABLE `holiday_database` DISABLE KEYS */;
/*!40000 ALTER TABLE `holiday_database` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `industry`
--

DROP TABLE IF EXISTS `industry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `industry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `industry`
--

LOCK TABLES `industry` WRITE;
/*!40000 ALTER TABLE `industry` DISABLE KEYS */;
INSERT INTO `industry` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'IT',0,'2021-04-21 19:53:50','2021-04-21 19:53:50');
/*!40000 ALTER TABLE `industry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_milestones`
--

DROP TABLE IF EXISTS `job_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_milestones`
--

LOCK TABLES `job_milestones` WRITE;
/*!40000 ALTER TABLE `job_milestones` DISABLE KEYS */;
INSERT INTO `job_milestones` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Date Of Joining','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Date Of Confirmation','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Custom','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `job_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_allocation`
--

DROP TABLE IF EXISTS `leave_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_allocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_type_policy_id` int NOT NULL,
  `month_number` int NOT NULL,
  `allocated_leaves` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_allocation`
--

LOCK TABLES `leave_allocation` WRITE;
/*!40000 ALTER TABLE `leave_allocation` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_balance`
--

DROP TABLE IF EXISTS `leave_balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_balance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `leave_type_id` int NOT NULL,
  `leave_balance` float NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `total_leaves` float NOT NULL DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_balance`
--

LOCK TABLES `leave_balance` WRITE;
/*!40000 ALTER TABLE `leave_balance` DISABLE KEYS */;
INSERT INTO `leave_balance` (`id`, `user_id`, `leave_type_id`, `leave_balance`, `is_deleted`, `created_at`, `updated_at`, `total_leaves`, `deleted_at`) VALUES (1,1,1,5,0,'2024-08-27 13:14:23','2024-08-27 13:14:23',0,'2024-11-13 11:27:39');
/*!40000 ALTER TABLE `leave_balance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_calendar_cycle`
--

DROP TABLE IF EXISTS `leave_calendar_cycle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_calendar_cycle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_calendar_cycle`
--

LOCK TABLES `leave_calendar_cycle` WRITE;
/*!40000 ALTER TABLE `leave_calendar_cycle` DISABLE KEYS */;
INSERT INTO `leave_calendar_cycle` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Jan - Dec','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Apr - Mar','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Custom','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `leave_calendar_cycle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_record`
--

DROP TABLE IF EXISTS `leave_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `leave_type_id` int NOT NULL,
  `day_type_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `half_day_type_id` int DEFAULT NULL,
  `reject_reason` varchar(255) DEFAULT NULL,
  `last_action_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `leave_record_half_day_type_id_foreign_idx` (`half_day_type_id`),
  KEY `leave_record_last_action_by_foreign_idx` (`last_action_by`),
  CONSTRAINT `leave_record_half_day_type_id_foreign_idx` FOREIGN KEY (`half_day_type_id`) REFERENCES `half_day_type` (`id`),
  CONSTRAINT `leave_record_last_action_by_foreign_idx` FOREIGN KEY (`last_action_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_record`
--

LOCK TABLES `leave_record` WRITE;
/*!40000 ALTER TABLE `leave_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_request`
--

DROP TABLE IF EXISTS `leave_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_record_id` int NOT NULL,
  `reporting_manager_id` int NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `priority` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `leave_record_id` (`leave_record_id`),
  KEY `reporting_manager_id` (`reporting_manager_id`),
  KEY `status` (`status`),
  CONSTRAINT `leave_request_ibfk_1` FOREIGN KEY (`leave_record_id`) REFERENCES `leave_record` (`id`),
  CONSTRAINT `leave_request_ibfk_2` FOREIGN KEY (`reporting_manager_id`) REFERENCES `reporting_managers` (`id`),
  CONSTRAINT `leave_request_ibfk_3` FOREIGN KEY (`status`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_request`
--

LOCK TABLES `leave_request` WRITE;
/*!40000 ALTER TABLE `leave_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_request_history`
--

DROP TABLE IF EXISTS `leave_request_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_request_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_record_id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `status_before` int NOT NULL,
  `status_after` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `leave_record_id` (`leave_record_id`),
  KEY `user_id` (`user_id`),
  KEY `status_before` (`status_before`),
  KEY `status_after` (`status_after`),
  CONSTRAINT `leave_request_history_ibfk_1` FOREIGN KEY (`leave_record_id`) REFERENCES `leave_record` (`id`),
  CONSTRAINT `leave_request_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `leave_request_history_ibfk_3` FOREIGN KEY (`status_before`) REFERENCES `approval_status` (`id`),
  CONSTRAINT `leave_request_history_ibfk_4` FOREIGN KEY (`status_after`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_request_history`
--

LOCK TABLES `leave_request_history` WRITE;
/*!40000 ALTER TABLE `leave_request_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_request_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_type`
--

DROP TABLE IF EXISTS `leave_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_type_name` varchar(255) NOT NULL,
  `negative_balance` tinyint(1) NOT NULL DEFAULT '0',
  `max_leave_allowed_in_negative_balance` int DEFAULT NULL,
  `max_days_per_leave` int NOT NULL,
  `max_days_per_month` int NOT NULL,
  `allow_half_days` tinyint(1) NOT NULL DEFAULT '0',
  `application_on_holidays` tinyint(1) NOT NULL DEFAULT '0',
  `restriction_for_application` tinyint(1) NOT NULL DEFAULT '0',
  `limit_back_dated_application` int DEFAULT NULL,
  `notice_for_application` int DEFAULT NULL,
  `auto_approval` tinyint(1) DEFAULT '0',
  `auto_action_after` int DEFAULT NULL,
  `auto_approval_action` int DEFAULT NULL,
  `supporting_document_mandatory` tinyint(1) DEFAULT '0',
  `prorated_accrual_first_month` tinyint(1) DEFAULT '0',
  `prorated_rounding` int DEFAULT NULL,
  `prorated_rounding_factor` float DEFAULT NULL,
  `encashment_yearly` tinyint(1) DEFAULT '0',
  `max_leaves_for_encashment` float DEFAULT NULL,
  `carry_forward_yearly` tinyint(1) DEFAULT '0',
  `carry_forward_rounding` int DEFAULT NULL,
  `carry_forward_rounding_factor` float DEFAULT NULL,
  `intra_cycle_carry_forward` tinyint(1) DEFAULT '0',
  `prefix_postfix_weekly_off_sandwhich_rule` tinyint(1) DEFAULT '0',
  `prefix_postfix_holiday_sandwhich_rule` tinyint(1) DEFAULT '0',
  `inbetween_weekly_off_sandwhich_rule` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `leave_application_after` int NOT NULL,
  `inbetween_holiday_sandwhich_rule` tinyint(1) DEFAULT '0',
  `custom_leave_application_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_type`
--

LOCK TABLES `leave_type` WRITE;
/*!40000 ALTER TABLE `leave_type` DISABLE KEYS */;
INSERT INTO `leave_type` (`id`, `leave_type_name`, `negative_balance`, `max_leave_allowed_in_negative_balance`, `max_days_per_leave`, `max_days_per_month`, `allow_half_days`, `application_on_holidays`, `restriction_for_application`, `limit_back_dated_application`, `notice_for_application`, `auto_approval`, `auto_action_after`, `auto_approval_action`, `supporting_document_mandatory`, `prorated_accrual_first_month`, `prorated_rounding`, `prorated_rounding_factor`, `encashment_yearly`, `max_leaves_for_encashment`, `carry_forward_yearly`, `carry_forward_rounding`, `carry_forward_rounding_factor`, `intra_cycle_carry_forward`, `prefix_postfix_weekly_off_sandwhich_rule`, `prefix_postfix_holiday_sandwhich_rule`, `inbetween_weekly_off_sandwhich_rule`, `created_at`, `updated_at`, `leave_application_after`, `inbetween_holiday_sandwhich_rule`, `custom_leave_application_date`) VALUES (1,'Casual Leave',1,2,5,4,1,1,0,20,5,0,4,1,0,0,1,0.1,1,0.1,0,1,0.01,0,0,1,1,'2024-08-27 13:14:23','2024-08-27 13:14:23',1,0,NULL);
/*!40000 ALTER TABLE `leave_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_type_policy`
--

DROP TABLE IF EXISTS `leave_type_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_type_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_policy_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `accrual_frequency` int DEFAULT NULL,
  `accrual_type` int DEFAULT NULL,
  `accrual_from` int DEFAULT NULL,
  `advance_accrual_for_entire_leave_year` tinyint(1) NOT NULL DEFAULT '0',
  `annual_eligibility` float DEFAULT NULL,
  `annual_breakup` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `accrual_from_custom_date` datetime DEFAULT NULL,
  `leave_type_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_type_policy`
--

LOCK TABLES `leave_type_policy` WRITE;
/*!40000 ALTER TABLE `leave_type_policy` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_type_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `letter`
--

DROP TABLE IF EXISTS `letter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `letter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `document_id` int NOT NULL,
  `letter_type` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `status` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `document_id` (`document_id`),
  KEY `status` (`status`),
  CONSTRAINT `letter_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `letter_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`),
  CONSTRAINT `letter_ibfk_3` FOREIGN KEY (`status`) REFERENCES `letter_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `letter`
--

LOCK TABLES `letter` WRITE;
/*!40000 ALTER TABLE `letter` DISABLE KEYS */;
/*!40000 ALTER TABLE `letter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `letter_status`
--

DROP TABLE IF EXISTS `letter_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `letter_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `letter_status`
--

LOCK TABLES `letter_status` WRITE;
/*!40000 ALTER TABLE `letter_status` DISABLE KEYS */;
INSERT INTO `letter_status` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'accepted','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'rejected','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'pending','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `letter_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marking_status`
--

DROP TABLE IF EXISTS `marking_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marking_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marking_status`
--

LOCK TABLES `marking_status` WRITE;
/*!40000 ALTER TABLE `marking_status` DISABLE KEYS */;
INSERT INTO `marking_status` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Late','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Absent','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Half-Day','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'Present','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `marking_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_policy`
--

DROP TABLE IF EXISTS `master_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(255) NOT NULL,
  `policy_description` text,
  `attendance_policy_id` int NOT NULL,
  `base_leave_configuration_id` int NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `shift_policy_id` int NOT NULL,
  `leave_workflow` int NOT NULL,
  `attendance_workflow` int NOT NULL,
  `weekly_off_policy_id` int NOT NULL,
  `holiday_calendar_id` int NOT NULL,
  `expense_workflow` int NOT NULL,
  `profile_change_workflow` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `attendance_policy_id` (`attendance_policy_id`),
  KEY `master_policy_weekly_off_policy_id_foreign_idx` (`weekly_off_policy_id`),
  KEY `master_policy_holiday_calendar_id_foreign_idx` (`holiday_calendar_id`),
  KEY `master_policy_expense_workflow_foreign_idx` (`expense_workflow`),
  KEY `profile_change_workflow` (`profile_change_workflow`),
  CONSTRAINT `master_policy_expense_workflow_foreign_idx` FOREIGN KEY (`expense_workflow`) REFERENCES `approval_flow` (`id`),
  CONSTRAINT `master_policy_holiday_calendar_id_foreign_idx` FOREIGN KEY (`holiday_calendar_id`) REFERENCES `holiday_calendar` (`id`),
  CONSTRAINT `master_policy_ibfk_1` FOREIGN KEY (`attendance_policy_id`) REFERENCES `attendance_policy` (`id`),
  CONSTRAINT `master_policy_ibfk_2` FOREIGN KEY (`profile_change_workflow`) REFERENCES `approval_flow` (`id`),
  CONSTRAINT `master_policy_profile_change_workflow_foreign_idx` FOREIGN KEY (`profile_change_workflow`) REFERENCES `approval_flow` (`id`),
  CONSTRAINT `master_policy_weekly_off_policy_id_foreign_idx` FOREIGN KEY (`weekly_off_policy_id`) REFERENCES `weekly_off_policy` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_policy`
--

LOCK TABLES `master_policy` WRITE;
/*!40000 ALTER TABLE `master_policy` DISABLE KEYS */;
INSERT INTO `master_policy` (`id`, `policy_name`, `policy_description`, `attendance_policy_id`, `base_leave_configuration_id`, `is_deleted`, `created_at`, `updated_at`, `shift_policy_id`, `leave_workflow`, `attendance_workflow`, `weekly_off_policy_id`, `holiday_calendar_id`, `expense_workflow`, `profile_change_workflow`) VALUES (1,'Glocalview Master','hehe',1,1,0,'2024-08-27 13:14:23','2024-11-13 11:27:39',1,1,1,1,1,1,1);
/*!40000 ALTER TABLE `master_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_policy_leave_policy`
--

DROP TABLE IF EXISTS `master_policy_leave_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_policy_leave_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `master_policy_id` int NOT NULL,
  `leave_type_id` int NOT NULL,
  `leave_type_policy_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `master_policy_id` (`master_policy_id`),
  KEY `leave_type_id` (`leave_type_id`),
  KEY `leave_type_policy_id` (`leave_type_policy_id`),
  CONSTRAINT `master_policy_leave_policy_ibfk_1` FOREIGN KEY (`master_policy_id`) REFERENCES `master_policy` (`id`),
  CONSTRAINT `master_policy_leave_policy_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`id`),
  CONSTRAINT `master_policy_leave_policy_ibfk_3` FOREIGN KEY (`leave_type_policy_id`) REFERENCES `leave_type_policy` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_policy_leave_policy`
--

LOCK TABLES `master_policy_leave_policy` WRITE;
/*!40000 ALTER TABLE `master_policy_leave_policy` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_policy_leave_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`name`) VALUES ('2023_03_23_00_User.ts'),('2023_03_23_01_Permissions.ts'),('2023_03_23_01_Roles.ts'),('2023_03_23_04_PermissionRoles.ts'),('2023_03_29_05_company.ts'),('2023_03_29_06_Company_Address.ts'),('2023_04_04_07_User_Company_Relationship.ts'),('2023_04_10_08_user_address.ts'),('2023_04_12_09_refresh_tokens.ts'),('2023_04_21_10_Industry.ts'),('2023_04_21_11_Country.ts'),('2023_04_27_12_Attendance_Status.ts'),('2023_04_28_13_regularisation_status.ts'),('2023_04_28_14_display_rules.ts'),('2023_04_28_15_shift_type.ts'),('2023_05_17_16_Attendance_Policy.ts'),('2023_05_18_17_Attendance_Record.ts'),('2023_05_31_18_Master_Policy.ts'),('2023_05_31_19_adding_masterpolicy_in_user.ts'),('2023_06_01_20_create_month_table.ts'),('2023_06_01_21_create_leave_calendar_cycle.ts'),('2023_06_01_22_Base_Leave_Configuration.ts'),('2023_06_01_23_create_rounding_type.ts'),('2023_06_01_24_create_approval_status.ts'),('2023_06_01_25_create_job_milestones.ts'),('2023_06_01_26_create_frequency.ts'),('2023_06_01_27_create_accural_type.ts'),('2023_06_01_28_create_calculation_parameters.ts'),('2023_06_01_29_create_day_of_month.ts'),('2023_06_01_30_create_rounding_time.ts'),('2023_06_01_31_leave_type.ts'),('2023_06_02_32_create_week.ts'),('2023_06_02_33_create_marking_status.ts'),('2023_06_16_34_leave_balance.ts'),('2023_06_19_35_Leave_Record.ts'),('2023_06_19_36_Peers_leave_record_relationship.ts'),('2023_06_20_37_password_change_column.ts'),('2023_06_20_38_day_type.ts'),('2023_07_19_39_regularisation_status_attendance_policy_table.ts'),('2023_07_20_40_default_attendance_status_column.ts'),('2023_07_20_41_changing_hours_of_day.ts'),('2023_07_20_42_adding_fields_attendance_policy.ts'),('2023_07_20_42_removing_regularisation_status_field_attendance_policy.ts'),('2023_07_20_43_shift_policy.ts'),('2023_07_20_45_shift_policy_data_type_change_time.ts'),('2023_07_20_45_shift_policy_data_type_exceed_flex_status.ts'),('2023_07_20_45_shift_policy_flexi_data_type_change.ts'),('2023_07_20_46_division_table.ts'),('2023_07_20_47_division_units.ts'),('2023_07_20_48_user_unit_table.ts'),('2023_07_20_49_removing_base_leave_configuration_column.ts'),('2023_07_20_50_accrual_table_rename.ts'),('2023_07_20_51_accrual_frequency.ts'),('2023_07_20_52_accrual_from.ts'),('2023_07_20_53_leave_allocation_table.ts'),('2023_07_20_54_leave_type_policy_table.ts'),('2023_07_20_55_leave_type_policy_column.ts'),('2023_07_20_56_leave_type_policy_rename_columns.ts'),('2023_07_20_57_leave_type_policy_extra_field.ts'),('2023_07_20_58_custom_month_base_leave_configuration.ts'),('2023_07_20_59_proxy_leave_column_change.ts'),('2023_07_20_60_notify_peer_mandatory_field.ts'),('2023_07_20_61_reporting_role_table.ts'),('2023_07_20_62_reporting_managers.ts'),('2023_07_20_63_leave_type_2_columns_add.ts'),('2023_07_20_64_leave_type_custom_application_date.ts'),('2023_07_20_65_approval_flow_type_table.ts'),('2023_07_20_66_approval_flow_table.ts'),('2023_07_20_67_approval_flow_reporting_role.ts'),('2023_07_20_68_approval_flow_reporting_role_undirect.ts'),('2023_07_20_69_leave_type_changing_columns_decimal.ts'),('2023_08_08_71_announcements.ts'),('2023_08_08_72_announcement_employee_relationship_table.ts'),('2023_08_08_73_creating_table_announcement_division_unit.ts'),('2023_08_08_74_adding_column_description_announcement_table.ts'),('2023_08_08_75_adding_column_created_at_and_deleted_at.ts'),('2023_08_08_76_adding_column_created_at_and_deleted_at_in_announcement_employee.ts'),('2023_08_09_77_notification_table.ts'),('2023_08_09_78_notification_image_change_column.ts'),('2023_08_09_79_changing_column_announcement_employee.ts'),('2023_08_09_80_asset_table_create.ts'),('2023_08_09_81_asset_table_column_extend.ts'),('2023_08_09_82_master_policy_workflow_attendance_leave.ts'),('2023_08_09_83_approval_flow_reporting_role_relationship_change_indirect.ts'),('2023_08_09_84_approval_flow_reporting_role_relationship_change.ts'),('2023_08_09_85_approval_flow_reporting_role_relationship_removing_constraint.ts'),('2023_08_09_86_approval_flow_reporting_role_indirect_column_change.ts'),('2023_08_09_87_api_holiday_database.ts'),('2023_08_09_88_holiday_calendar_creation.ts'),('2023_08_09_89_holida_holidayCalendar_association.ts'),('2023_08_3_70_expenses_categories_table.ts'),('2023_08_31_90_custom_holiday_table_creation.ts'),('2023_08_31_91_profile_image_column.ts'),('2023_09_04_92_weekly_off_policy_creation.ts'),('2023_09_04_93_week_off_association_table.ts'),('2023_09_04_94_user_fcm_token_and_device_id_refresh_table.ts'),('2023_09_13_95_expenses_approval_status_table.ts'),('2023_09_13_96_expenses_purpuse_table.ts'),('2023_09_14_97_expenses_table.ts'),('2023_09_20_98_expenses_categories_form_table.ts'),('2023_09_20_99_add_form_id_expenses_categories_table.ts'),('2023_09_21_100_add_columns_expenses_table.ts'),('2023_09_21_101_add_columns_expenses_approval_status_table.ts'),('2023_09_21_102_division_units_system_generated_fiels.ts'),('2023_09_21_103_change_column_type_user_designation_department.ts'),('2023_09_21_104_remove_column_user_id_from_asset.ts'),('2023_09_25_105_create_table_assigned_asset.ts'),('2023_09_26_106_password_recovery_create_table.ts'),('2023_09_26_107_add_phone_field_in_user.ts'),('2023_09_27_108_assigned_field_in_asset.ts'),('2023_09_28_109_gender_column_change.ts'),('2023_09_28_110_gender_create_new_column.ts'),('2023_09_28_111_reporting_role_column_in_user.ts'),('2023_10_05_112_removing_designation_department_column.ts'),('2023_10_06_113_create_regularization_request_status_table.ts'),('2023_10_06_114_create_regularization_request_table.ts'),('2023_10_06_115_add_column_date.ts'),('2023_10_06_116_change_shift_policy_column_data_type.ts'),('2023_10_10_117_creating_column_base_working_hours_in_shift_policy.ts'),('2023_10_10_118_master_policy_leave_type_policy_relationship.ts'),('2023_10_10_119_adding_new_columns_to_master_policy_table.ts'),('2023_10_10_120_reporting_manager_role_nullible.ts'),('2023_10_11_121_user_reporting_association_table.ts'),('2023_10_25_122_leave_requests.ts'),('2023_12_11_123_family_relation_dropdown.ts'),('2023_12_11_124_family_member_table.ts'),('2023_12_12_126_adding_deleted_at_column_reporting_manager.ts'),('2023_12_13_127_profile_image_uploads.ts'),('2023_12_19_128_division_id_in_user_division_tables.ts'),('2023_12_21_129_types_of_employement_table.ts'),('2023_12_21_130_create_table_experience.ts'),('2023_12_26_131_create_education_type.ts'),('2023_12_26_132_create_education_table.ts'),('2023_12_28_133_add_columns_to_attendance_table.ts'),('2023_12_28_134_creating_column_user_id_in_profile_image_table.ts'),('2023_12_29_135_adding_column_user_id_regularization_record.ts'),('2024_01_02_136_adding_column_total_leaves_in_leave_balance.ts'),('2024_01_03_137_Creating_table_for_regularization_request.ts'),('2024_01_04_138_creating_table_document.ts'),('2024_01_04_139_creating_table_profile_change_record.ts'),('2024_01_04_140_creating_table_profile_change_request.ts'),('2024_01_12_141_adding_column_custom_holiday.ts'),('2024_02_06_142_create_table_half_day_type.ts'),('2024_02_06_143_adding_column_half_day_type.ts'),('2024_02_20_144_adding_column_deleted_at.ts'),('2024_02_22_145_profile_change_request_workflow.ts'),('2024_02_22_146_changing_profile_change_request_workflow_column_to_not_null.ts'),('2024_02_22_147_leave_balance_deleted_at.ts'),('2024_03_05_148_user_employee_id_uniqueness.ts'),('2024_03_05_149_leave_rejection_reason_column.ts'),('2024_03_26_150_change_announcement_start_date_and_end_date.ts'),('2024_04_03_151_education_column_change.ts'),('2024_04_12_152_add_session_id.ts'),('2024_04_23_153_letter_status.ts'),('2024_04_23_154_letter_migration.ts'),('2024_05_02_155_changing_billing_status_column.ts'),('2024_05_02_156_adding_column_document.ts'),('2024_05_06_157_creating_expense_request_table.ts'),('2024_05_07_158_adding_column_comment_to_expense.ts'),('2024_05_10_159_adding_column_is_file_to_documents.ts'),('2024_05_10_159_updating_expense_expencesCategories_form_column.ts'),('2024_07_24_160_creating_punch_location_table.ts'),('2024_11_13_161_changing_of_time_in_attendance.ts'),('2024_11_15_162_changing_of_time_in_regularisation_request.ts'),('2024_11_26_163_regularisation_record_history.ts'),('2024_12_02_164_leave_record_history.ts'),('2024_12_02_165_expense_record_history.ts'),('2024_12_03_166_profile_change_record_history.ts');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `months`
--

DROP TABLE IF EXISTS `months`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `months` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `months`
--

LOCK TABLES `months` WRITE;
/*!40000 ALTER TABLE `months` DISABLE KEYS */;
INSERT INTO `months` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'January','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'February','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'March','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'April','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'May','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'June','2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'July','2024-08-27 13:14:23','2024-08-27 13:14:23'),(8,'August','2024-08-27 13:14:23','2024-08-27 13:14:23'),(9,'September','2024-08-27 13:14:23','2024-08-27 13:14:23'),(10,'October','2024-08-27 13:14:23','2024-08-27 13:14:23'),(11,'November','2024-08-27 13:14:23','2024-08-27 13:14:23'),(12,'December','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `months` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_recovery`
--

DROP TABLE IF EXISTS `password_recovery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_recovery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `otp` varchar(255) NOT NULL,
  `sent_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_recovery`
--

LOCK TABLES `password_recovery` WRITE;
/*!40000 ALTER TABLE `password_recovery` DISABLE KEYS */;
INSERT INTO `password_recovery` (`id`, `user_id`, `email`, `phone`, `otp`, `sent_at`, `expires_at`, `created_at`, `updated_at`) VALUES (1,4,'vimal.gupta@glocalview.com','7584758439','631374','2025-03-31 06:03:39','2025-03-31 06:08:39','2024-11-13 10:20:22','2025-03-31 06:03:39');
/*!40000 ALTER TABLE `password_recovery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peers_leave_record`
--

DROP TABLE IF EXISTS `peers_leave_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peers_leave_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_record_id` int NOT NULL,
  `peer_user_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peers_leave_record`
--

LOCK TABLES `peers_leave_record` WRITE;
/*!40000 ALTER TABLE `peers_leave_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `peers_leave_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `level` text,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` (`id`, `name`, `level`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'employee_dashboard.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(2,'employee_dashboard.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(3,'employee_dashboard.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(4,'employee_dashboard.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(5,'employee_attendance.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(6,'employee_attendance.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(7,'employee_attendance.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(8,'employee_attendance.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(9,'employee_leaves.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(10,'employee_leaves.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(11,'employee_leaves.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(12,'employee_leaves.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(13,'employee_notifications.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(14,'employee_notifications.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(15,'employee_notifications.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(16,'employee_notifications.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(17,'employee_profile.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(18,'employee_profile.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(19,'employee_profile.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(20,'employee_profile.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(21,'manager_dashboard.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(22,'manager_dashboard.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(23,'manager_dashboard.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(24,'manager_dashboard.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(25,'regularisation_requests.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(26,'regularisation_requests.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(27,'regularisation_requests.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(28,'regularisation_requests.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(29,'leave_requests.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(30,'leave_requests.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(31,'leave_requests.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(32,'leave_requests.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(33,'reimbursements_requests.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(34,'reimbursements_requests.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(35,'reimbursements_requests.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(36,'reimbursements_requests.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(37,'profile_update_requests.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(38,'profile_update_requests.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(39,'profile_update_requests.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(40,'profile_update_requests.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(41,'admin_dashboard.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(42,'admin_dashboard.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(43,'admin_dashboard.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(44,'admin_dashboard.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(45,'employee_list.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(46,'employee_list.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(47,'employee_list.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(48,'employee_list.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(49,'policies_summary.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(50,'policies_summary.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(51,'policies_summary.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(52,'policies_summary.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(53,'division.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(54,'division.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(55,'division.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(56,'division.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(57,'reporting_structure.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(58,'reporting_structure.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(59,'reporting_structure.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(60,'reporting_structure.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(61,'approval_flow.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(62,'approval_flow.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(63,'approval_flow.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(64,'approval_flow.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(65,'manage_assets.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(66,'manage_assets.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(67,'manage_assets.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(68,'manage_assets.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(69,'assign_assets.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(70,'assign_assets.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(71,'assign_assets.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(72,'assign_assets.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(73,'role_permissions.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(74,'role_permissions.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(75,'role_permissions.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(76,'role_permissions.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(77,'announcements.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(78,'announcements.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(79,'announcements.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(80,'announcements.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(81,'attendance_policies.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(82,'attendance_policies.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(83,'attendance_policies.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(84,'attendance_policies.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(85,'leave_policies.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(86,'leave_policies.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(87,'leave_policies.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(88,'leave_policies.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(89,'weekly_off_policies.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(90,'weekly_off_policies.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(91,'weekly_off_policies.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(92,'weekly_off_policies.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(93,'master_policies.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(94,'master_policies.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(95,'master_policies.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(96,'master_policies.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(97,'holiday_calendar.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(98,'holiday_calendar.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(99,'holiday_calendar.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(100,'holiday_calendar.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(101,'other_employee.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(102,'other_employee.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(103,'other_employee.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(104,'other_employee.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(105,'admin_reports.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(106,'admin_reports.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(107,'admin_reports.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(108,'admin_reports.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(109,'employee_expense.view','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(110,'employee_expense.add','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(111,'employee_expense.edit','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44'),(112,'employee_expense.delete','high',1,0,'2024-08-27 18:24:44','2024-08-27 18:24:44');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions_roles`
--

DROP TABLE IF EXISTS `permissions_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permissions_id` int NOT NULL,
  `roles_id` int NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions_roles`
--

LOCK TABLES `permissions_roles` WRITE;
/*!40000 ALTER TABLE `permissions_roles` DISABLE KEYS */;
INSERT INTO `permissions_roles` (`id`, `permissions_id`, `roles_id`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,1,1,0,NULL,NULL),(2,2,1,0,NULL,NULL),(3,3,1,0,NULL,NULL),(4,4,1,0,NULL,NULL),(5,5,1,0,NULL,NULL),(6,6,1,0,NULL,NULL),(7,7,1,0,NULL,NULL),(8,8,1,0,NULL,NULL),(9,9,1,0,NULL,NULL),(10,10,1,0,NULL,NULL),(11,11,1,0,NULL,NULL),(12,12,1,0,NULL,NULL),(13,13,1,0,NULL,NULL),(14,14,1,0,NULL,NULL),(15,15,1,0,NULL,NULL),(16,16,1,0,NULL,NULL),(17,17,1,0,NULL,NULL),(18,18,1,0,NULL,NULL),(19,19,1,0,NULL,NULL),(20,20,1,0,NULL,NULL),(21,21,1,0,NULL,NULL),(22,22,1,0,NULL,NULL),(23,23,1,0,NULL,NULL),(24,24,1,0,NULL,NULL),(25,25,1,0,NULL,NULL),(26,26,1,0,NULL,NULL),(27,27,1,0,NULL,NULL),(28,28,1,0,NULL,NULL),(29,29,1,0,NULL,NULL),(30,30,1,0,NULL,NULL),(31,31,1,0,NULL,NULL),(32,32,1,0,NULL,NULL),(33,33,1,0,NULL,NULL),(34,34,1,0,NULL,NULL),(35,35,1,0,NULL,NULL),(36,36,1,0,NULL,NULL),(37,37,1,0,NULL,NULL),(38,38,1,0,NULL,NULL),(39,39,1,0,NULL,NULL),(40,40,1,0,NULL,NULL),(41,41,1,0,NULL,NULL),(42,42,1,0,NULL,NULL),(43,43,1,0,NULL,NULL),(44,44,1,0,NULL,NULL),(45,45,1,0,NULL,NULL),(46,46,1,0,NULL,NULL),(47,47,1,0,NULL,NULL),(48,48,1,0,NULL,NULL),(49,49,1,0,NULL,NULL),(50,50,1,0,NULL,NULL),(51,51,1,0,NULL,NULL),(52,52,1,0,NULL,NULL),(53,53,1,0,NULL,NULL),(54,54,1,0,NULL,NULL),(55,55,1,0,NULL,NULL),(56,56,1,0,NULL,NULL),(57,57,1,0,NULL,NULL),(58,58,1,0,NULL,NULL),(59,59,1,0,NULL,NULL),(60,60,1,0,NULL,NULL),(61,61,1,0,NULL,NULL),(62,62,1,0,NULL,NULL),(63,63,1,0,NULL,NULL),(64,64,1,0,NULL,NULL),(65,65,1,0,NULL,NULL),(66,66,1,0,NULL,NULL),(67,67,1,0,NULL,NULL),(68,68,1,0,NULL,NULL),(69,69,1,0,NULL,NULL),(70,70,1,0,NULL,NULL),(71,71,1,0,NULL,NULL),(72,72,1,0,NULL,NULL),(73,73,1,0,NULL,NULL),(74,74,1,0,NULL,NULL),(75,75,1,0,NULL,NULL),(76,76,1,0,NULL,NULL),(77,77,1,0,NULL,NULL),(78,78,1,0,NULL,NULL),(79,79,1,0,NULL,NULL),(80,80,1,0,NULL,NULL),(81,81,1,0,NULL,NULL),(82,82,1,0,NULL,NULL),(83,83,1,0,NULL,NULL),(84,84,1,0,NULL,NULL),(85,85,1,0,NULL,NULL),(86,86,1,0,NULL,NULL),(87,87,1,0,NULL,NULL),(88,88,1,0,NULL,NULL),(89,89,1,0,NULL,NULL),(90,90,1,0,NULL,NULL),(91,91,1,0,NULL,NULL),(92,92,1,0,NULL,NULL),(93,93,1,0,NULL,NULL),(94,94,1,0,NULL,NULL),(95,95,1,0,NULL,NULL),(96,96,1,0,NULL,NULL),(97,97,1,0,NULL,NULL),(98,98,1,0,NULL,NULL),(99,99,1,0,NULL,NULL),(100,100,1,0,NULL,NULL),(101,101,1,0,NULL,NULL),(102,102,1,0,NULL,NULL),(103,103,1,0,NULL,NULL),(104,104,1,0,NULL,NULL),(105,105,1,0,NULL,NULL),(106,106,1,0,NULL,NULL),(107,107,1,0,NULL,NULL),(108,108,1,0,NULL,NULL),(109,109,1,0,NULL,NULL),(110,110,1,0,NULL,NULL),(111,111,1,0,NULL,NULL),(112,112,1,0,NULL,NULL),(261,1,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(262,2,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(263,3,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(264,4,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(265,17,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(266,18,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(267,19,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(268,20,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(269,5,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(270,6,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(271,7,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(272,8,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(273,9,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(274,10,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(275,11,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(276,12,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(277,13,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(278,14,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(279,15,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(280,16,3,0,'2024-09-11 15:37:12','2024-09-11 15:37:12'),(281,1,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(282,2,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(283,3,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(284,4,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(285,5,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(286,6,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(287,7,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(288,8,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(289,9,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(290,10,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(291,11,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(292,12,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(293,13,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(294,14,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(295,15,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(296,16,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(297,17,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(298,18,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(299,19,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(300,20,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(301,21,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(302,22,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(303,23,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(304,24,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(305,25,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(306,26,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(307,27,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(308,28,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(309,29,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(310,30,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(311,31,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(312,32,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(313,33,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(314,34,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(315,35,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(316,36,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(317,37,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(318,38,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(319,39,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(320,40,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(321,41,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(322,42,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(323,43,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(324,44,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(325,45,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(326,46,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(327,47,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(328,48,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(329,49,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(330,50,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(331,51,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(332,52,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(333,53,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(334,54,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(335,55,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(336,56,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(337,57,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(338,58,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(339,59,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(340,60,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(341,61,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(342,62,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(343,63,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(344,64,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(345,65,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(346,66,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(347,67,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(348,68,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(349,69,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(350,70,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(351,71,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(352,72,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(353,73,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(354,74,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(355,75,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(356,76,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(357,77,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(358,78,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(359,79,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(360,80,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(361,81,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(362,82,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(363,83,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(364,84,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(365,85,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(366,86,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(367,87,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(368,88,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(369,89,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(370,90,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(371,91,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(372,92,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(373,93,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(374,94,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(375,95,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(376,96,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(377,97,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(378,98,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(379,99,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(380,100,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(381,101,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(382,102,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(383,103,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(384,104,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(385,105,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(386,106,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(387,107,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(388,108,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(389,109,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(390,110,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(391,111,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(392,112,4,0,'2024-09-11 15:45:39','2024-09-11 15:45:39'),(393,1,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(394,2,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(395,3,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(396,4,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(397,5,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(398,6,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(399,7,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(400,8,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(401,9,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(402,10,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(403,11,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(404,12,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(405,13,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(406,14,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(407,15,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(408,16,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(409,17,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(410,18,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(411,19,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(412,20,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(413,21,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(414,22,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(415,23,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(416,24,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(417,29,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(418,30,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(419,31,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(420,32,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(421,25,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(422,26,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(423,27,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39'),(424,28,2,0,'2024-09-11 15:52:39','2024-09-11 15:52:39');
/*!40000 ALTER TABLE `permissions_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_change_record`
--

DROP TABLE IF EXISTS `profile_change_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_change_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `section` varchar(255) NOT NULL,
  `previous` json NOT NULL,
  `change` json NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  CONSTRAINT `profile_change_record_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `profile_change_record_ibfk_2` FOREIGN KEY (`status`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_change_record`
--

LOCK TABLES `profile_change_record` WRITE;
/*!40000 ALTER TABLE `profile_change_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_change_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_change_request`
--

DROP TABLE IF EXISTS `profile_change_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_change_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile_change_record_id` int NOT NULL,
  `reporting_manager_id` int NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `priority` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profile_change_record_id` (`profile_change_record_id`),
  KEY `reporting_manager_id` (`reporting_manager_id`),
  KEY `status` (`status`),
  CONSTRAINT `profile_change_request_ibfk_1` FOREIGN KEY (`profile_change_record_id`) REFERENCES `profile_change_record` (`id`),
  CONSTRAINT `profile_change_request_ibfk_2` FOREIGN KEY (`reporting_manager_id`) REFERENCES `reporting_managers` (`id`),
  CONSTRAINT `profile_change_request_ibfk_3` FOREIGN KEY (`status`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_change_request`
--

LOCK TABLES `profile_change_request` WRITE;
/*!40000 ALTER TABLE `profile_change_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_change_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_change_request_history`
--

DROP TABLE IF EXISTS `profile_change_request_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_change_request_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile_change_record_id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `status_before` int NOT NULL,
  `status_after` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `profile_change_record_id` (`profile_change_record_id`),
  KEY `user_id` (`user_id`),
  KEY `status_before` (`status_before`),
  KEY `status_after` (`status_after`),
  CONSTRAINT `profile_change_request_history_ibfk_1` FOREIGN KEY (`profile_change_record_id`) REFERENCES `profile_change_record` (`id`),
  CONSTRAINT `profile_change_request_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `profile_change_request_history_ibfk_3` FOREIGN KEY (`status_before`) REFERENCES `approval_status` (`id`),
  CONSTRAINT `profile_change_request_history_ibfk_4` FOREIGN KEY (`status_after`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_change_request_history`
--

LOCK TABLES `profile_change_request_history` WRITE;
/*!40000 ALTER TABLE `profile_change_request_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_change_request_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_images`
--

DROP TABLE IF EXISTS `profile_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `public_url` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '2',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `profile_images_user_id_foreign_idx` (`user_id`),
  CONSTRAINT `profile_images_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_images`
--

LOCK TABLES `profile_images` WRITE;
/*!40000 ALTER TABLE `profile_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `punch_location`
--

DROP TABLE IF EXISTS `punch_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `punch_location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attendance_log_id` int NOT NULL,
  `punch_time` datetime NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `location` json DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_log_id` (`attendance_log_id`),
  CONSTRAINT `punch_location_ibfk_1` FOREIGN KEY (`attendance_log_id`) REFERENCES `attendance` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `punch_location`
--

LOCK TABLES `punch_location` WRITE;
/*!40000 ALTER TABLE `punch_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `punch_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh`
--

DROP TABLE IF EXISTS `refresh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `refresh_token` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh`
--

LOCK TABLES `refresh` WRITE;
/*!40000 ALTER TABLE `refresh` DISABLE KEYS */;
INSERT INTO `refresh` (`id`, `user_id`, `refresh_token`, `created_at`, `updated_at`, `device_id`, `fcm_token`, `session_id`) VALUES (2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6IjBjNGZkMWFlLWQyODQtNGUxZC1iOGM1LTQ2MmQyOWMwNThjNCIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNDY1NTksImV4cCI6MTcyNzM0MjU1OX0.WP8QE831CL8W5facqZQesCVhfAdrT05NAEDXsIHhDXA','2024-09-11 14:52:39','2024-09-11 14:52:39',NULL,NULL,'0c4fd1ae-d284-4e1d-b8c5-462d29c058c4'),(5,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Miwic2Vzc2lvbl9pZCI6IjUxZjU4MDhiLWFlNWYtNDg3OC1hZTFjLTU0ZDVhN2NhMzhiMyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNDc4MDcsImV4cCI6MTcyNzM0MzgwN30.oHJwCiQuawFUo3ZKQSlrjAC2V0m2brnOmrkR_u7ShMg','2024-09-11 15:13:27','2024-09-11 15:13:27',NULL,NULL,'51f5808b-ae5f-4878-ae1c-54d5a7ca38b3'),(6,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Miwic2Vzc2lvbl9pZCI6ImYzZjNlOTZiLWE4ODctNGVjNy1hZWVkLTRjOGRkMWNiMjBkMSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNDc4MTMsImV4cCI6MTcyNzM0MzgxM30.zVP3ZmqQNHsFAr8EoKzd-BeyyROTNbEzKOcQjx9vowY','2024-09-11 15:13:33','2024-09-11 15:13:33',NULL,NULL,'f3f3e96b-a887-4ec7-aeed-4c8dd1cb20d1'),(7,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Mywic2Vzc2lvbl9pZCI6IjE5MDQ2ZWM3LTA0Y2ItNDczZi1hZjY2LWEwM2U0MzE2MWRlNiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNDc4MzMsImV4cCI6MTcyNzM0MzgzM30.-51Sx7n00siPqlX-cWk6Mudw5xsUGPS1lrCIa1cjYYo','2024-09-11 15:13:53','2024-09-11 15:13:53',NULL,NULL,'19046ec7-04cb-473f-af66-a03e43161de6'),(9,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Niwic2Vzc2lvbl9pZCI6IjI0YWM4YzQ1LWNjNjQtNDU4MS1iNTRkLTE0YWU1YmZlODBjMSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNDgxNTEsImV4cCI6MTcyNzM0NDE1MX0.XpCN-S5lq0gJ_TimuI19kSKuzjR-g0mlbZ7WDjjvk0o','2024-09-11 15:19:11','2024-09-11 15:19:11',NULL,NULL,'24ac8c45-cc64-4581-b54d-14ae5bfe80c1'),(10,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Niwic2Vzc2lvbl9pZCI6ImZmZjk4M2Q5LTQwMzUtNDczZS04NjJhLWRmMWNjYmRkODQ1NyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNDg1MzEsImV4cCI6MTcyNzM0NDUzMX0.Z99TXNTWojbcCv24Rf6OkkvASSFODQJ8t4ExH08L6Bw','2024-09-11 15:25:31','2024-09-11 15:25:31',NULL,NULL,'fff983d9-4035-473e-862a-df1ccbdd8457'),(20,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6IjBmZThiZmNiLTZiYTQtNGMxMC1iNTQzLTIzYmI2ZDhhMzYwNyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNTAxMTAsImV4cCI6MTcyNzM0NjExMH0.wWBhVKY946QAk1pX_66fbHs1NA3B29W_7YtmeN1mGGs','2024-09-11 15:51:50','2024-09-11 15:51:50',NULL,NULL,'0fe8bfcb-6ba4-4c10-b543-23bb6d8a3607'),(21,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6IjJhMTk3YmMwLWYwNzYtNDk0Yy1hM2NiLTllOTIxZmFlNDJkYyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjY0ODA0MDAsImV4cCI6MTcyNzc3NjQwMH0.iP2ChyHecnYs-jGd2pXdjWaatVnQyGZIUxIlf2LWWt0','2024-09-11 15:52:43','2024-09-16 15:23:20',NULL,NULL,'2a197bc0-f076-494c-a3cb-9e921fae42dc'),(22,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6ImZhZTYwZTg1LTJmMjktNDgyMi1hNmE2LTA1NWY2ZGJmMzlkMSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjYwNTAyNjksImV4cCI6MTcyNzM0NjI2OX0.173XoMHppBRPYRwvY-UPE2GFh7URH8Im6xmcYzxCmC0','2024-09-11 15:54:29','2024-09-11 15:54:29',NULL,NULL,'fae60e85-2f29-4822-a6a6-055f6dbf39d1'),(24,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Niwic2Vzc2lvbl9pZCI6IjM5ZmQ3YWFlLTRlYzUtNDgwNy04NjgwLWUxODIxZWJhNThjMSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MjY0ODA0MjIsImV4cCI6MTcyNzc3NjQyMn0.k-K1Dc7xOhjd5YPYytkCWORm_jsPCygphvtqvwMimI4','2024-09-16 15:23:42','2024-09-16 15:23:42',NULL,NULL,'39fd7aae-4ec5-4807-8680-e1821eba58c1'),(27,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6IjgyNTkyZTExLWNkNWItNDRkYy05YjYwLTU5Mjg5NjU0YzM0NiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3Mjk4NDY5MDIsImV4cCI6MTczMTE0MjkwMn0.sDlX9b97onCOQ-Gi4CD36ZT1CMWCrZyQmQ9Twsh0Wfo','2024-10-25 12:10:37','2024-10-25 14:31:42',NULL,NULL,'82592e11-cd5b-44dc-9b60-59289654c346'),(28,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6ImM0MTk4MmZiLTdiZGYtNGE5My05ZWU4LTRmOGJiZDg5Y2QyMSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3Mjk4NDc4NDAsImV4cCI6MTczMTE0Mzg0MH0.Hs9pdS6Y73xmHUTqKBWcmsthkTFXBCH_CxRrlAkQLI8','2024-10-25 14:47:20','2024-10-25 14:47:20',NULL,NULL,'c41982fb-7bdf-4a93-9ee8-4f8bbd89cd21'),(31,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6Ijc3YjcxNjJiLWUzMDgtNDk1Mi1iMTAyLTZjYWY5OWM5Mzc0NCIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzE1NzU2NzcsImV4cCI6MTczMjg3MTY3N30.zcbGiUzAizp_UxA8a1q88bLKfznQDwHK7QXAH5h8eZA','2024-11-13 10:26:43','2024-11-14 14:44:37',NULL,NULL,'77b7162b-e308-4952-b102-6caf99c93744'),(32,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6IjYwMGRhMjEzLWQ3ZGItNGNmNC1iNDg4LTdiNjViNDI3NzE5ZiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzE0NzQzMTQsImV4cCI6MTczMjc3MDMxNH0._h21DW3_u-kvbv-acdUbDQyLvpMmsdaHeZSsin_KHxQ','2024-11-13 10:35:14','2024-11-13 10:35:14',NULL,'dm_lHL9qG0f6k65NB_dkwp:APA91bEu0kqFIse9iVAWhZ3XA9tHKquBxQODDywWOskfz9jatqAHe1JHKOdVd4QLc1H76wuXaxJIKG7T8dVELEgOTC_uYIEiyKuf9_QjyYWak2eU5na0-fA','600da213-d7db-4cf4-b488-7b65b427719f'),(34,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6ImNjNTA1YjFlLTFkNWMtNDBiMC1hNTkyLWJkODZmNmVhNzFlNiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzE1NzkyMzksImV4cCI6MTczMjg3NTIzOX0.cQfYH10SGWys6gKSoePJe-pLeA4L5PE4V7XzstKuBw8','2024-11-14 15:43:59','2024-11-14 15:43:59','iPhone17,2',NULL,'cc505b1e-1d5c-40b0-a592-bd86f6ea71e6'),(35,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6IjhmZjc4N2Q2LTk5ZDQtNDAwOC1iMzhlLTI2ZTI0MmZkODAwMyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzE2OTI1NDEsImV4cCI6MTczMjk4ODU0MX0.L6v7a8lIgY9DaP5QNip8WV8ju-2IPWjBJdUN2DiaskA','2024-11-15 22:42:35','2024-11-15 23:12:21','iPhone17,2',NULL,'8ff787d6-99d4-4008-b38e-26e242fd8003'),(37,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6IjRkNDhlYWYxLTUxNzgtNGE5My04NDVlLWFmMWE2OWRjZDAyMyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzM3Mzk5NjAsImV4cCI6MTczNTAzNTk2MH0.5yBszOqZgr4y0MKpC3FGvI5uoUdwV53I9smFdSh9rF4','2024-12-09 10:26:00','2024-12-09 10:26:00',NULL,NULL,'4d48eaf1-5178-4a93-845e-af1a69dcd023'),(38,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6ImM5ZTM4M2M0LTI0OWEtNDM1NS1hYWU3LTZjZmI3ODVhMGFkZiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzQ0NTg4OTcsImV4cCI6MTczNTc1NDg5N30.yozrrWKTp23AlZqqwOZSTU-gdEazIb_ODTCcVz8kVmM','2024-12-09 10:43:07','2024-12-17 18:08:17',NULL,NULL,'c9e383c4-249a-4355-aae7-6cfb785a0adf'),(39,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6Ijg0NmQ1MTM5LTNlMzItNDRmMC1hZGUzLTE4ZWJhZGI3YzM4YyIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzM3NTA5NTAsImV4cCI6MTczNTA0Njk1MH0.kJJkBk64Y8JltB9NBoCXGFofUcMnpqbWDOoyvDEI-J4','2024-12-09 13:29:10','2024-12-09 13:29:10',NULL,NULL,'846d5139-3e32-44f0-ade3-18ebadb7c38c'),(40,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6IjVlNDQ1MjM4LTc4NTgtNGFhNC1hNDU4LTI5YTA4NDkzNzUwMiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzM4MTQ0NDEsImV4cCI6MTczNTExMDQ0MX0.l9F-gQ2jl1EUiDBnCVOclL9mdqgocmHsZT8N7Refl9U','2024-12-10 06:28:38','2024-12-10 07:07:21',NULL,NULL,'5e445238-7858-4aa4-a458-29a084937502'),(41,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6ImZmNGJmNDAxLTIwMmMtNDM0Yi1hYzc5LWNjYTQ2MzYyMWQ1OCIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzM4MTYxODEsImV4cCI6MTczNTExMjE4MX0.3uo786axOn20oFTErl0XV6HLJLiLCkhDHcaFNySYdqQ','2024-12-10 07:08:36','2024-12-10 07:36:21',NULL,NULL,'ff4bf401-202c-434b-ac79-cca463621d58'),(42,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6IjIyYjZiZjMzLThkMzktNDAyZS05NmFhLWU2MjQwNGViMzliZiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzM4MTYyMzEsImV4cCI6MTczNTExMjIzMX0.rahdt1_TYr3yyj64QldrQ3Vq5IThKqa7x2bHWep_d20','2024-12-10 07:37:11','2024-12-10 07:37:11',NULL,NULL,'22b6bf33-8d39-402e-96aa-e62404eb39bf'),(43,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6Ijc0ZTNjZGM2LTJjYzktNGQwYi04N2YyLWY0OTVjMDdlY2NiNSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzkxODA3MTIsImV4cCI6MTc0MDQ3NjcxMn0.HNocfia4Y1fdTPZEMMZ5aiGZ3hdQFkb9a8zTNq3W6IY','2025-02-10 09:45:12','2025-02-10 09:45:12',NULL,NULL,'74e3cdc6-2cc9-4d0b-87f2-f495c07eccb5'),(44,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6MSwic2Vzc2lvbl9pZCI6IjQyNmVlMDliLTE5YTAtNDljYy05MjgwLTRjZjQ4NTI2YzUwZCIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NDMxNDQyMTEsImV4cCI6MTc0NDQ0MDIxMX0.nBbb1FtwxRyuR3D084udbv5CFeHQCBvYhS3vJJlvP7U','2025-03-28 06:27:08','2025-03-28 06:43:31',NULL,NULL,'426ee09b-19a0-49cc-9280-4cf48526c50d'),(45,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6NCwic2Vzc2lvbl9pZCI6ImVlMjkyNjZhLTU0NzctNDk4MS05ZGI0LTU4YTAyMjYwMDQyMiIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NDM1NjgxMjgsImV4cCI6MTc0NDg2NDEyOH0.fkhgFYL_mbKvu7-RsoxJY7bVAIwuSqAiWQ5czO0aang','2025-03-31 08:21:21','2025-04-02 04:28:48',NULL,NULL,'ee29266a-5477-4981-9db4-58a022600422'),(46,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbXBsb3llZV9pZCI6Niwic2Vzc2lvbl9pZCI6IjFiN2NjNDYwLTQ2YzgtNDQ2Ny1hYzgxLTBiNjU0YWJlNjllMSIsInRva2VuVHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NDcyMTg5NzAsImV4cCI6MTc0ODUxNDk3MH0.ZFEKz1hVU7gK5J20sfF_SiTzt9ilhTXlY6ksY4KZ48M','2025-05-14 10:36:10','2025-05-14 10:36:10',NULL,NULL,'1b7cc460-46c8-4467-ac81-0b654abe69e1');
/*!40000 ALTER TABLE `refresh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularisation_request_history`
--

DROP TABLE IF EXISTS `regularisation_request_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regularisation_request_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `regularisation_record_id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `status_before` int NOT NULL,
  `status_after` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `regularisation_record_id` (`regularisation_record_id`),
  KEY `user_id` (`user_id`),
  KEY `status_before` (`status_before`),
  KEY `status_after` (`status_after`),
  CONSTRAINT `regularisation_request_history_ibfk_1` FOREIGN KEY (`regularisation_record_id`) REFERENCES `regularization_record` (`id`),
  CONSTRAINT `regularisation_request_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `regularisation_request_history_ibfk_3` FOREIGN KEY (`status_before`) REFERENCES `approval_status` (`id`),
  CONSTRAINT `regularisation_request_history_ibfk_4` FOREIGN KEY (`status_after`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularisation_request_history`
--

LOCK TABLES `regularisation_request_history` WRITE;
/*!40000 ALTER TABLE `regularisation_request_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularisation_request_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularisation_status`
--

DROP TABLE IF EXISTS `regularisation_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regularisation_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularisation_status`
--

LOCK TABLES `regularisation_status` WRITE;
/*!40000 ALTER TABLE `regularisation_status` DISABLE KEYS */;
INSERT INTO `regularisation_status` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'absent',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'field visit',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'half day',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'half day',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'holiday',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'onduty',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'present',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(8,'weekly off',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(9,'work from home',0,'2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `regularisation_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularisation_status_attendance_policy`
--

DROP TABLE IF EXISTS `regularisation_status_attendance_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regularisation_status_attendance_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attendance_policy_id` int NOT NULL,
  `regularisation_status_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularisation_status_attendance_policy`
--

LOCK TABLES `regularisation_status_attendance_policy` WRITE;
/*!40000 ALTER TABLE `regularisation_status_attendance_policy` DISABLE KEYS */;
INSERT INTO `regularisation_status_attendance_policy` (`id`, `attendance_policy_id`, `regularisation_status_id`, `created_at`, `updated_at`) VALUES (4,1,1,'2024-11-13 11:26:22','2024-11-13 11:26:22'),(5,1,3,'2024-11-13 11:26:22','2024-11-13 11:26:22');
/*!40000 ALTER TABLE `regularisation_status_attendance_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularization_record`
--

DROP TABLE IF EXISTS `regularization_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regularization_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `in_time` datetime DEFAULT NULL,
  `out_time` datetime DEFAULT NULL,
  `request_status` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `date` date NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `request_status` (`request_status`),
  KEY `status` (`status`),
  KEY `regularization_record_user_id_foreign_idx` (`user_id`),
  CONSTRAINT `regularization_record_ibfk_1` FOREIGN KEY (`request_status`) REFERENCES `attendance_status` (`id`),
  CONSTRAINT `regularization_record_ibfk_2` FOREIGN KEY (`status`) REFERENCES `approval_status` (`id`),
  CONSTRAINT `regularization_record_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularization_record`
--

LOCK TABLES `regularization_record` WRITE;
/*!40000 ALTER TABLE `regularization_record` DISABLE KEYS */;
INSERT INTO `regularization_record` (`id`, `in_time`, `out_time`, `request_status`, `reason`, `status`, `created_at`, `updated_at`, `date`, `user_id`) VALUES (1,'2025-03-28 03:30:00','2025-03-28 12:30:00',3,'dasfafasdf',1,'2025-03-28 06:37:47','2025-03-28 06:37:47','2025-03-10',1);
/*!40000 ALTER TABLE `regularization_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularization_request`
--

DROP TABLE IF EXISTS `regularization_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regularization_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `regularization_record_id` int NOT NULL,
  `reporting_manager_id` int NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `priority` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `regularization_record_id` (`regularization_record_id`),
  KEY `reporting_manager_id` (`reporting_manager_id`),
  KEY `status` (`status`),
  CONSTRAINT `regularization_request_ibfk_1` FOREIGN KEY (`regularization_record_id`) REFERENCES `regularization_record` (`id`),
  CONSTRAINT `regularization_request_ibfk_2` FOREIGN KEY (`reporting_manager_id`) REFERENCES `reporting_managers` (`id`),
  CONSTRAINT `regularization_request_ibfk_3` FOREIGN KEY (`status`) REFERENCES `approval_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularization_request`
--

LOCK TABLES `regularization_request` WRITE;
/*!40000 ALTER TABLE `regularization_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularization_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularization_request_status`
--

DROP TABLE IF EXISTS `regularization_request_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regularization_request_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularization_request_status`
--

LOCK TABLES `regularization_request_status` WRITE;
/*!40000 ALTER TABLE `regularization_request_status` DISABLE KEYS */;
INSERT INTO `regularization_request_status` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'Approved',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Pending',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Rejected',0,'2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `regularization_request_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relation`
--

DROP TABLE IF EXISTS `relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation`
--

LOCK TABLES `relation` WRITE;
/*!40000 ALTER TABLE `relation` DISABLE KEYS */;
INSERT INTO `relation` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Spouse','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Father','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Mother','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'Mother-in-law','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'Father-in-law','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'Sibling','2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'Child','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporting_manager_employee_association`
--

DROP TABLE IF EXISTS `reporting_manager_employee_association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporting_manager_employee_association` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reporting_role_id` int NOT NULL,
  `reporting_manager_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `reporting_role_id` (`reporting_role_id`),
  KEY `reporting_manager_id` (`reporting_manager_id`),
  CONSTRAINT `reporting_manager_employee_association_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `reporting_manager_employee_association_ibfk_2` FOREIGN KEY (`reporting_role_id`) REFERENCES `reporting_role` (`id`),
  CONSTRAINT `reporting_manager_employee_association_ibfk_3` FOREIGN KEY (`reporting_manager_id`) REFERENCES `reporting_managers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporting_manager_employee_association`
--

LOCK TABLES `reporting_manager_employee_association` WRITE;
/*!40000 ALTER TABLE `reporting_manager_employee_association` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporting_manager_employee_association` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporting_managers`
--

DROP TABLE IF EXISTS `reporting_managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporting_managers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reporting_role_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `reporting_role_id` (`reporting_role_id`),
  CONSTRAINT `reporting_managers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `reporting_managers_ibfk_2` FOREIGN KEY (`reporting_role_id`) REFERENCES `reporting_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporting_managers`
--

LOCK TABLES `reporting_managers` WRITE;
/*!40000 ALTER TABLE `reporting_managers` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporting_managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporting_role`
--

DROP TABLE IF EXISTS `reporting_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporting_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `priority` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `priority` (`priority`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporting_role`
--

LOCK TABLES `reporting_role` WRITE;
/*!40000 ALTER TABLE `reporting_role` DISABLE KEYS */;
INSERT INTO `reporting_role` (`id`, `name`, `priority`, `created_at`, `updated_at`) VALUES (1,'CEO',1,'2024-09-11 15:40:35','2024-09-11 15:40:35'),(2,'Project Manager',2,'2024-09-11 15:41:01','2024-09-11 15:41:01'),(3,'Supervisor',3,'2024-09-11 15:47:52','2024-09-11 15:47:52');
/*!40000 ALTER TABLE `reporting_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `alias` text,
  `description` text,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `is_system_generated` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`, `alias`, `description`, `status`, `is_deleted`, `is_system_generated`, `created_at`, `updated_at`) VALUES (1,'Admin','admin','This role is for the main Administrator',1,0,1,'2023-03-23 19:53:50','2023-03-23 19:53:50'),(2,'HR','HR','This role is for the HR',1,0,1,'2023-03-23 19:53:50','2023-03-23 19:53:50'),(3,'Supervisor','supervisor','This role is for the Managers/Supervisors',1,0,1,'2023-03-23 19:53:50','2023-03-23 19:53:50'),(4,'Employee','employee','This role is for the employees',1,0,1,'2023-03-23 19:53:50','2023-03-23 19:53:50');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rounding_time`
--

DROP TABLE IF EXISTS `rounding_time`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rounding_time` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounding_time`
--

LOCK TABLES `rounding_time` WRITE;
/*!40000 ALTER TABLE `rounding_time` DISABLE KEYS */;
INSERT INTO `rounding_time` (`id`, `time`, `created_at`, `updated_at`) VALUES (1,'10 minutes','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'20 minutes','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'30 minutes','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'40 minutes','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'50 minutes','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'60 minutes','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `rounding_time` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rounding_type`
--

DROP TABLE IF EXISTS `rounding_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rounding_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounding_type`
--

LOCK TABLES `rounding_type` WRITE;
/*!40000 ALTER TABLE `rounding_type` DISABLE KEYS */;
INSERT INTO `rounding_type` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Rounding To Nearest','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Rounding Up','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Rounding Down','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `rounding_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_policy`
--

DROP TABLE IF EXISTS `shift_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(255) NOT NULL,
  `shift_description` varchar(255) DEFAULT NULL,
  `notes_for_punch` tinyint(1) DEFAULT '0',
  `allow_single_punch` tinyint(1) DEFAULT '0',
  `shift_type_id` int DEFAULT NULL,
  `shift_start_time` time DEFAULT NULL,
  `shift_end_time` time DEFAULT NULL,
  `pre_shift_duration` float DEFAULT NULL,
  `post_shift_duration` float DEFAULT NULL,
  `consider_breaks` tinyint(1) NOT NULL,
  `break_duration` float DEFAULT NULL,
  `break_start_time` time DEFAULT NULL,
  `break_end_time` time DEFAULT NULL,
  `enable_grace` tinyint(1) NOT NULL,
  `grace_duration_allowed` int DEFAULT NULL,
  `number_of_days_grace_allowed` int DEFAULT NULL,
  `status_grace_exceeded` int DEFAULT NULL,
  `enable_grace_recurring` tinyint(1) DEFAULT '0',
  `enable_flex` tinyint(1) DEFAULT '0',
  `flex_start_time` float DEFAULT NULL,
  `flexi_duration_allowed` float DEFAULT NULL,
  `number_of_days_flexi_allowed` int DEFAULT NULL,
  `status_flexi_exceeded` int DEFAULT NULL,
  `status_punch_in_time_exceeded` int DEFAULT NULL,
  `enable_flex_recurring` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `base_working_hours` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_policy`
--

LOCK TABLES `shift_policy` WRITE;
/*!40000 ALTER TABLE `shift_policy` DISABLE KEYS */;
INSERT INTO `shift_policy` (`id`, `shift_name`, `shift_description`, `notes_for_punch`, `allow_single_punch`, `shift_type_id`, `shift_start_time`, `shift_end_time`, `pre_shift_duration`, `post_shift_duration`, `consider_breaks`, `break_duration`, `break_start_time`, `break_end_time`, `enable_grace`, `grace_duration_allowed`, `number_of_days_grace_allowed`, `status_grace_exceeded`, `enable_grace_recurring`, `enable_flex`, `flex_start_time`, `flexi_duration_allowed`, `number_of_days_flexi_allowed`, `status_flexi_exceeded`, `status_punch_in_time_exceeded`, `enable_flex_recurring`, `created_at`, `updated_at`, `base_working_hours`) VALUES (1,'Basic Shift Policy','kjasdjkahsdjkashdasdasd',0,0,1,'09:30:00','06:30:00',30,30,0,30,'13:00:00','13:30:00',0,30,5,1,0,1,30,30,5,1,1,0,'2024-11-13 11:27:18','2024-11-13 11:27:18',0);
/*!40000 ALTER TABLE `shift_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_type`
--

DROP TABLE IF EXISTS `shift_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_type`
--

LOCK TABLES `shift_type` WRITE;
/*!40000 ALTER TABLE `shift_type` DISABLE KEYS */;
INSERT INTO `shift_type` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'start end time',0,'2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'working hours',0,'2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `shift_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(255) NOT NULL,
  `employee_generated_id` varchar(255) NOT NULL,
  `date_of_joining` date NOT NULL,
  `probation_period` varchar(255) DEFAULT NULL,
  `probation_due_date` date DEFAULT NULL,
  `work_location` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `cost_center` varchar(255) DEFAULT NULL,
  `employee_official_email` varchar(255) NOT NULL,
  `employee_personal_email` varchar(255) DEFAULT NULL,
  `dob_adhaar` date NOT NULL,
  `dob_celebrated` date DEFAULT NULL,
  `employee_gender_id` int NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `role_id` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `employee_password` varchar(255) NOT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `mother_tongue` varchar(255) DEFAULT NULL,
  `alternate_email` varchar(255) DEFAULT NULL,
  `alternate_contact` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_branch` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `payroll_details` varchar(255) DEFAULT NULL,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `pan_number` varchar(255) DEFAULT NULL,
  `adhaar_number` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `company_id` int NOT NULL,
  `master_policy_id` int NOT NULL,
  `password_changed` tinyint(1) NOT NULL DEFAULT '0',
  `profile_image_id` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `reporting_role_id` int DEFAULT NULL,
  `reporting_manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_generated_id` (`employee_generated_id`),
  KEY `user_master_policy_id_foreign_idx` (`master_policy_id`),
  KEY `user_reporting_role_id_foreign_idx` (`reporting_role_id`),
  KEY `user_reporting_manager_id_foreign_idx` (`reporting_manager_id`),
  CONSTRAINT `user_master_policy_id_foreign_idx` FOREIGN KEY (`master_policy_id`) REFERENCES `master_policy` (`id`),
  CONSTRAINT `user_reporting_manager_id_foreign_idx` FOREIGN KEY (`reporting_manager_id`) REFERENCES `reporting_managers` (`id`),
  CONSTRAINT `user_reporting_role_id_foreign_idx` FOREIGN KEY (`reporting_role_id`) REFERENCES `reporting_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `employee_name`, `employee_generated_id`, `date_of_joining`, `probation_period`, `probation_due_date`, `work_location`, `level`, `grade`, `cost_center`, `employee_official_email`, `employee_personal_email`, `dob_adhaar`, `dob_celebrated`, `employee_gender_id`, `is_deleted`, `role_id`, `status`, `employee_password`, `blood_group`, `nationality`, `mother_tongue`, `alternate_email`, `alternate_contact`, `religion`, `bank_name`, `bank_branch`, `account_number`, `ifsc_code`, `payroll_details`, `account_holder_name`, `pan_number`, `adhaar_number`, `created_at`, `updated_at`, `deleted_at`, `company_id`, `master_policy_id`, `password_changed`, `profile_image_id`, `phone`, `reporting_role_id`, `reporting_manager_id`) VALUES (1,'Anugrah','GV-01','2023-04-03',NULL,NULL,NULL,NULL,NULL,NULL,'anugrah.bhatt@glocalview.com','bhattanugrah@gmail.com','1998-05-27','1998-05-27',1,0,1,1,'$2b$10$RLY1GHdKJrENyeJ/QAfx.uVYH6RmJ9AJZua7UJElSrbRFY/3M0xdi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-23 16:00:00','2024-09-11 14:53:25',NULL,1,1,1,NULL,'9773914237',NULL,NULL),(2,'Vikram Singh','GV-02','2023-08-25',NULL,NULL,NULL,NULL,NULL,NULL,'vikram.singh@glocalview.com','vikramsingh@gmail.com','1994-02-02','1994-02-02',1,0,2,1,'$2a$10$SVa70bcShZkOM.rrA40yiervvqRdNmhlDQbA.UyjxzuxyM2w19IA.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-23 16:00:00','2023-03-23 16:00:00',NULL,1,1,0,NULL,'8787382309',NULL,NULL),(3,'Shikha Shukla','GV-03','2023-08-25',NULL,NULL,NULL,NULL,NULL,NULL,'shikha.shukla@glocalview.com','shikhashukla@gmail.com','1998-03-03','1998-03-03',1,0,3,1,'$2a$10$zlrETii0yY5VGTQh8wz8pOns7QkJbK5jqh42mnZpXVEbOCHiPEccC',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-23 16:00:00','2023-03-23 16:00:00',NULL,1,1,0,NULL,'7584758439',NULL,NULL),(4,'Vimal Gupta','GV-04','2023-08-25',NULL,NULL,NULL,NULL,NULL,NULL,'vimal.gupta@glocalview.com','vimalgupta@gmail.com','1998-03-03','1998-03-03',1,0,2,1,'$2b$10$9h.UnzACpnUfMI/kRADwBebI.9p70QcuJkj37cmSlcmKvh2KLs3cu',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-23 16:00:00','2024-11-13 10:26:04',NULL,1,1,1,NULL,'7584758439',NULL,NULL),(5,'Harshit Sharma','GV-05','2023-08-25',NULL,NULL,NULL,NULL,NULL,NULL,'harshit.sharma@glocalview.com','harshit@gmail.com','1998-03-03','1998-03-03',1,0,2,1,'$2a$10$7b3eWLnnoj8N1SFhvCkdrO7ysDO/XUoSv0KCyPd4a6padmyGjyAaW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-23 16:00:00','2023-03-23 16:00:00',NULL,1,1,0,NULL,'7584758439',NULL,NULL),(6,'Deepak Tiwari','GLI0132','2022-12-15',NULL,NULL,NULL,NULL,NULL,NULL,'deepak.tiwari@glocalview.com',NULL,'1988-07-06','1988-07-06',1,0,3,1,'$2b$10$juiPGcBda542ttwqv/symOBncqGaPE/DEFRJivA0gEosTQYJ0Kv3e',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-11 15:18:21','2024-09-11 15:26:02',NULL,1,1,1,NULL,'9911259308',NULL,NULL),(7,'Umesh Kumar','GV-06','2024-09-11',NULL,NULL,NULL,NULL,NULL,NULL,'umesh.kumar@glocalview.com',NULL,'2006-09-10','2006-09-10',1,0,3,1,'$2b$10$yctJFhKVXe3kZGC.cHSJIu/E58MbP.e79iRTAXBguWx2svdfUpS.G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-11 15:51:05','2024-09-11 15:51:05',NULL,1,1,0,NULL,'8375999456',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_division`
--

DROP TABLE IF EXISTS `user_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_division` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `unit_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `division_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_division`
--

LOCK TABLES `user_division` WRITE;
/*!40000 ALTER TABLE `user_division` DISABLE KEYS */;
INSERT INTO `user_division` (`id`, `user_id`, `unit_id`, `created_at`, `updated_at`, `division_id`) VALUES (1,6,2,'2024-09-11 15:18:21','2024-09-11 15:18:21',2);
/*!40000 ALTER TABLE `user_division` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `week`
--

DROP TABLE IF EXISTS `week`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `week` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `week`
--

LOCK TABLES `week` WRITE;
/*!40000 ALTER TABLE `week` DISABLE KEYS */;
INSERT INTO `week` (`id`, `name`, `created_at`, `updated_at`) VALUES (1,'Monday','2024-08-27 13:14:23','2024-08-27 13:14:23'),(2,'Tuesday','2024-08-27 13:14:23','2024-08-27 13:14:23'),(3,'Wednesday','2024-08-27 13:14:23','2024-08-27 13:14:23'),(4,'Thursday','2024-08-27 13:14:23','2024-08-27 13:14:23'),(5,'Friday','2024-08-27 13:14:23','2024-08-27 13:14:23'),(6,'Saturday','2024-08-27 13:14:23','2024-08-27 13:14:23'),(7,'Sunday','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `week` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_off_association`
--

DROP TABLE IF EXISTS `weekly_off_association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_off_association` (
  `id` int NOT NULL AUTO_INCREMENT,
  `weekly_off_policy_id` int NOT NULL,
  `week_name` int NOT NULL,
  `week_number` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `weekly_off_policy_id` (`weekly_off_policy_id`),
  KEY `week_name` (`week_name`),
  CONSTRAINT `weekly_off_association_ibfk_1` FOREIGN KEY (`weekly_off_policy_id`) REFERENCES `weekly_off_policy` (`id`),
  CONSTRAINT `weekly_off_association_ibfk_2` FOREIGN KEY (`week_name`) REFERENCES `week` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_off_association`
--

LOCK TABLES `weekly_off_association` WRITE;
/*!40000 ALTER TABLE `weekly_off_association` DISABLE KEYS */;
/*!40000 ALTER TABLE `weekly_off_association` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_off_policy`
--

DROP TABLE IF EXISTS `weekly_off_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_off_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_off_policy`
--

LOCK TABLES `weekly_off_policy` WRITE;
/*!40000 ALTER TABLE `weekly_off_policy` DISABLE KEYS */;
INSERT INTO `weekly_off_policy` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES (1,'Standard Weekly off policy','testing policy','2024-08-27 13:14:23','2024-08-27 13:14:23');
/*!40000 ALTER TABLE `weekly_off_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'minhrms_staging'
--

--
-- Dumping routines for database 'minhrms_staging'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-05  2:09:28
