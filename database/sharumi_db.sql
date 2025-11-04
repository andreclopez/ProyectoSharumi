-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: sharumi
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `administradores_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (4,NULL);
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archivos`
--

DROP TABLE IF EXISTS `archivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `nombreOriginal` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `peso` int NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `idProducto` int DEFAULT NULL,
  `fechaSubida` datetime NOT NULL,
  `idCategoria` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idProducto` (`idProducto`),
  KEY `idCategoria` (`idCategoria`),
  CONSTRAINT `archivos_ibfk_27` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `archivos_ibfk_28` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivos`
--

LOCK TABLES `archivos` WRITE;
/*!40000 ALTER TABLE `archivos` DISABLE KEYS */;
INSERT INTO `archivos` VALUES (1,'1759237774570-3w0yfz.png','Para ti.png','image/png',298150,'uploads/productos/7/1759237774570-3w0yfz.png',NULL,'2025-09-30 13:09:34',NULL),(13,'1759768244449-89ga03.png','Tinto4.png','image/png',149214,'uploads/productos/portadas/1759768244449-89ga03.png',8,'2025-10-06 16:30:44',NULL),(15,'1759785149117-ofwrkf.png','Tinto5.png','image/png',256961,'uploads/productos/portadas/1759785149117-ofwrkf.png',20,'2025-10-06 21:12:29',NULL),(23,'1759847422055-gmirgx.png','Tinto2.png','image/png',66977,'uploads/productos/portadas/1759847422055-gmirgx.png',20,'2025-10-07 14:30:22',NULL),(54,'1761079749261-976161481-Tinto4.png','Tinto4.png','image/png',149214,'uploads/categorias/portadas/1761079749261-976161481-Tinto4.png',NULL,'2025-10-21 20:49:09',3),(55,'1761079760304-333339446-Tinto3.png','Tinto3.png','image/png',220368,'uploads/categorias/portadas/1761079760304-333339446-Tinto3.png',NULL,'2025-10-21 20:49:20',2),(68,'1761918544691-zgm0h7.png','sauvignonBlanc.png','image/png',185530,'uploads/productos/portadas/1761918544691-zgm0h7.png',21,'2025-10-31 13:49:04',NULL),(69,'1761918544965-ki8vut.png','sauvignonBlanc-1.png','image/png',164195,'uploads/productos/21/1761918544965-ki8vut.png',21,'2025-10-31 13:49:04',NULL),(70,'1761918544973-6pa9qu.png','sauvignonBlanc-2.png','image/png',102758,'uploads/productos/21/1761918544973-6pa9qu.png',21,'2025-10-31 13:49:04',NULL),(71,'1761918639494-a7sllw.png','chadornnay.png','image/png',155201,'uploads/productos/portadas/1761918639494-a7sllw.png',20,'2025-10-31 13:50:39',NULL),(72,'1761918639605-wt86ce.png','chadornnay-1.png','image/png',143289,'uploads/productos/20/1761918639605-wt86ce.png',20,'2025-10-31 13:50:39',NULL),(73,'1761918639617-929b2s.png','chadornnay-2.png','image/png',187996,'uploads/productos/20/1761918639617-929b2s.png',20,'2025-10-31 13:50:39',NULL),(74,'1761918768228-9cagjr.png','torrontes-1.png','image/png',236714,'uploads/productos/portadas/1761918768228-9cagjr.png',27,'2025-10-31 13:52:48',NULL),(75,'1761918768308-znc2vy.png','torrontes.png','image/png',264800,'uploads/productos/27/1761918768308-znc2vy.png',27,'2025-10-31 13:52:48',NULL),(76,'1761918768313-bzwvq1.png','torrontes-2.png','image/png',206752,'uploads/productos/27/1761918768313-bzwvq1.png',27,'2025-10-31 13:52:48',NULL),(78,'1761918846762-yf8aay.png','Syrah-1.png','image/png',142123,'uploads/productos/portadas/1761918846762-yf8aay.png',8,'2025-10-31 13:54:06',NULL),(79,'1761919001752-6pi8fk.png','merlotRose-1.png','image/png',218084,'uploads/productos/portadas/1761919001752-6pi8fk.png',6,'2025-10-31 13:56:41',NULL),(80,'1761919015808-ca4hz5.png','merlotRose.png','image/png',219195,'uploads/productos/6/1761919015808-ca4hz5.png',6,'2025-10-31 13:56:55',NULL),(81,'1761919015810-viplrb.png','merlotRose-2.png','image/png',241183,'uploads/productos/6/1761919015810-viplrb.png',6,'2025-10-31 13:56:55',NULL),(84,'1761920070047-ytmpi5.png','moscato.png','image/png',274549,'uploads/productos/portadas/1761920070047-ytmpi5.png',28,'2025-10-31 14:14:30',NULL),(85,'1761920070134-ry2yng.png','moscato-1.png','image/png',194714,'uploads/productos/28/1761920070134-ry2yng.png',28,'2025-10-31 14:14:30',NULL),(86,'1761920070144-htwn5l.png','moscato-2.png','image/png',196497,'uploads/productos/28/1761920070144-htwn5l.png',28,'2025-10-31 14:14:30',NULL),(87,'1761920186118-nwihun.png','pinotGris.png','image/png',90659,'uploads/productos/portadas/1761920186118-nwihun.png',29,'2025-10-31 14:16:26',NULL),(88,'1761920186206-wilqji.png','pinotGris-1.png','image/png',286651,'uploads/productos/29/1761920186206-wilqji.png',29,'2025-10-31 14:16:26',NULL),(89,'1761920186214-w2m7vb.png','pinotGris-2.png','image/png',39089,'uploads/productos/29/1761920186214-w2m7vb.png',29,'2025-10-31 14:16:26',NULL),(90,'1761920308498-urqhz9.png','verdejo-2.png','image/png',199235,'uploads/productos/portadas/1761920308498-urqhz9.png',30,'2025-10-31 14:18:28',NULL),(91,'1761920308576-n82wuf.png','verdejo.png','image/png',60567,'uploads/productos/30/1761920308576-n82wuf.png',30,'2025-10-31 14:18:28',NULL),(92,'1761920308577-k5dvay.png','verdejo-1.png','image/png',335109,'uploads/productos/30/1761920308577-k5dvay.png',30,'2025-10-31 14:18:28',NULL),(93,'1761920374182-vbhjgy.png','sauvignonBlanc-1.png','image/png',164195,'uploads/productos/portadas/1761920374182-vbhjgy.png',10,'2025-10-31 14:19:34',NULL),(94,'1761920736272-ymv7if.png','Cabernet-2.png','image/png',260817,'uploads/productos/portadas/1761920736272-ymv7if.png',31,'2025-10-31 14:25:36',NULL),(95,'1761920736340-5t523v.png','Cabernet.png','image/png',156167,'uploads/productos/31/1761920736340-5t523v.png',31,'2025-10-31 14:25:36',NULL),(96,'1761920736344-b5pqb6.png','Cabernet-1.png','image/png',338462,'uploads/productos/31/1761920736344-b5pqb6.png',31,'2025-10-31 14:25:36',NULL),(97,'1761920785688-f5f6va.png','Merlot.png','image/png',149761,'uploads/productos/portadas/1761920785688-f5f6va.png',32,'2025-10-31 14:26:25',NULL),(98,'1761920785743-mgnd66.png','Merlot-1.png','image/png',281758,'uploads/productos/32/1761920785743-mgnd66.png',32,'2025-10-31 14:26:25',NULL),(99,'1761920785746-kyhexc.png','Merlot-2.png','image/png',197136,'uploads/productos/32/1761920785746-kyhexc.png',32,'2025-10-31 14:26:25',NULL),(100,'1761920845806-84u6ou.png','Tempranillo-3.png','image/png',146727,'uploads/productos/portadas/1761920845806-84u6ou.png',33,'2025-10-31 14:27:25',NULL),(101,'1761920845887-mwtvvz.png','Tempranillo.png','image/png',218945,'uploads/productos/33/1761920845887-mwtvvz.png',33,'2025-10-31 14:27:25',NULL),(102,'1761920845889-qp934b.png','Tempranillo-1.png','image/png',261750,'uploads/productos/33/1761920845889-qp934b.png',33,'2025-10-31 14:27:25',NULL),(103,'1761920948808-1bm3m6.png','PinotNoir-2.png','image/png',110769,'uploads/productos/portadas/1761920948808-1bm3m6.png',34,'2025-10-31 14:29:08',NULL),(104,'1761920948870-cyp8rs.png','PinotNoir.png','image/png',414872,'uploads/productos/34/1761920948870-cyp8rs.png',34,'2025-10-31 14:29:08',NULL),(105,'1761920948873-bvqvg7.png','PinotNoir-1.png','image/png',41203,'uploads/productos/34/1761920948873-bvqvg7.png',34,'2025-10-31 14:29:08',NULL),(107,'1761920992250-ovdsic.png','Malbec.png','image/png',140931,'uploads/productos/35/1761920992250-ovdsic.png',35,'2025-10-31 14:29:52',NULL),(108,'1761920992252-dyvv0s.png','Malbec-2.png','image/png',197735,'uploads/productos/35/1761920992252-dyvv0s.png',35,'2025-10-31 14:29:52',NULL),(109,'1761921076128-o1cw0h.png','merlotRosado-1.png','image/png',298823,'uploads/productos/portadas/1761921076128-o1cw0h.png',36,'2025-10-31 14:31:16',NULL),(110,'1761921076183-jl54z9.png','merlotRosado.png','image/png',136133,'uploads/productos/36/1761921076183-jl54z9.png',36,'2025-10-31 14:31:16',NULL),(111,'1761921076185-jsk1as.png','merlotRosado-2.png','image/png',72914,'uploads/productos/36/1761921076185-jsk1as.png',36,'2025-10-31 14:31:16',NULL),(112,'1761921121657-scf9xz.png','pinotNoirRose-2.png','image/png',158776,'uploads/productos/portadas/1761921121657-scf9xz.png',37,'2025-10-31 14:32:01',NULL),(113,'1761921121711-p7ypzm.png','pinotNoirRose.png','image/png',220902,'uploads/productos/37/1761921121711-p7ypzm.png',37,'2025-10-31 14:32:01',NULL),(114,'1761921121714-cnc0sv.png','pinotNoirRose-1.png','image/png',291357,'uploads/productos/37/1761921121714-cnc0sv.png',37,'2025-10-31 14:32:01',NULL),(115,'1761921179945-fs8rc6.png','malbecRose-2.png','image/png',99957,'uploads/productos/portadas/1761921179945-fs8rc6.png',38,'2025-10-31 14:32:59',NULL),(116,'1761921180000-d3k0s0.png','malbecRose.png','image/png',228053,'uploads/productos/38/1761921180000-d3k0s0.png',38,'2025-10-31 14:33:00',NULL),(117,'1761921180003-qnuece.png','malbecRose-1.png','image/png',275603,'uploads/productos/38/1761921180003-qnuece.png',38,'2025-10-31 14:33:00',NULL),(118,'1761921545208-k92le5.png','SyrahRosado.png','image/png',479778,'uploads/productos/portadas/1761921545208-k92le5.png',39,'2025-10-31 14:39:05',NULL),(119,'1761921545270-actjfv.png','SyrahRosado-1.png','image/png',251153,'uploads/productos/39/1761921545270-actjfv.png',39,'2025-10-31 14:39:05',NULL),(120,'1761921545276-vjaoxv.png','SyrahRosado-2.png','image/png',85448,'uploads/productos/39/1761921545276-vjaoxv.png',39,'2025-10-31 14:39:05',NULL),(121,'1761930748260-fnzhck.png','SauvignonRose-2.png','image/png',159101,'uploads/productos/portadas/1761930748260-fnzhck.png',40,'2025-10-31 17:12:28',NULL),(122,'1761930748381-uk9e5e.png','SantaDigna.png','image/png',254564,'uploads/productos/40/1761930748381-uk9e5e.png',40,'2025-10-31 17:12:28',NULL),(124,'1761930748388-smvi7x.png','SauvignonRose-3.png','image/png',115943,'uploads/productos/40/1761930748388-smvi7x.png',40,'2025-10-31 17:12:28',NULL),(125,'1761930850437-k863i6.png','Botella.png','image/png',319823,'uploads/productos/portadas/1761930850437-k863i6.png',35,'2025-10-31 17:14:10',NULL),(126,'1761930882002-1pjlf1.png','SauvignonRose.png','image/png',50888,'uploads/productos/40/1761930882002-1pjlf1.png',40,'2025-10-31 17:14:42',NULL),(127,'1761930882002-ev1agk.png','SauvignonRose-1.png','image/png',250614,'uploads/productos/40/1761930882002-ev1agk.png',40,'2025-10-31 17:14:42',NULL),(131,'1761931068378-455175718-portada.png','portada.png','image/png',121764,'uploads/categorias/portadas/1761931068378-455175718-portada.png',NULL,'2025-10-31 17:17:48',4),(133,'1761931153239-879036327-Tinto1.png','Tinto1.png','image/png',141506,'uploads/categorias/portadas/1761931153239-879036327-Tinto1.png',NULL,'2025-10-31 17:19:13',56),(134,'1761931177038-673868769-Botella.png','Botella.png','image/png',319823,'uploads/categorias/portadas/1761931177038-673868769-Botella.png',NULL,'2025-10-31 17:19:37',46),(135,'1762200285404-00dbku.png','Tinto5.png','image/png',256961,'uploads/productos/30/1762200285404-00dbku.png',30,'2025-11-03 20:04:45',NULL);
/*!40000 ALTER TABLE `archivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaAlta` datetime NOT NULL,
  `estado` enum('activo','cerrado','cancelado') NOT NULL,
  `idUsuario` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
INSERT INTO `carritos` VALUES (3,'2025-09-08 00:00:00','activo',10,'2025-09-08 20:25:44','2025-09-08 20:25:44');
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritosxproductos`
--

DROP TABLE IF EXISTS `carritosxproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritosxproductos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `idCarrito` int NOT NULL,
  `idProducto` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCarrito` (`idCarrito`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `carritosxproductos_ibfk_375` FOREIGN KEY (`idCarrito`) REFERENCES `carritos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carritosxproductos_ibfk_376` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritosxproductos`
--

LOCK TABLES `carritosxproductos` WRITE;
/*!40000 ALTER TABLE `carritosxproductos` DISABLE KEYS */;
INSERT INTO `carritosxproductos` VALUES (4,2,9600.00,3,6);
/*!40000 ALTER TABLE `carritosxproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `imagenUrl` varchar(255) DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `descripcion` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (2,'Rosé Wine','/uploads/categorias/portadas/1761079760304-333339446-Tinto3.png',1,'Vinos rosados'),(3,'Red Wine Argentina','/uploads/categorias/portadas/1761079749261-976161481-Tinto4.png',1,'Vino tinto '),(4,'White Wine ','/uploads/categorias/portadas/1761931068378-455175718-portada.png',1,'Vinos blancos'),(46,'Destacados','/uploads/categorias/portadas/1761931177038-673868769-Botella.png',1,'Productos destacados'),(56,'Oferta','/uploads/categorias/portadas/1761931153239-879036327-Tinto1.png',1,'Aquí podrás encontrar nuestros productos con descuentos importantes. ');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cupones`
--

DROP TABLE IF EXISTS `cupones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cupones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCupon` varchar(255) NOT NULL COMMENT 'Nombre descriptivo',
  `codigoCupon` varchar(255) NOT NULL COMMENT 'Codigo que ingresará el cliente',
  `porcentajeDescuento` int NOT NULL COMMENT 'Porcentaje de descuento que se aplicará',
  `activo` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si el cupón puede ser utilizado',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigoCupon` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_2` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_3` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_4` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_5` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_6` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_7` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_8` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_9` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_10` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_11` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_12` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_13` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_14` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_15` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_16` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_17` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_18` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_19` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_20` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_21` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_22` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_23` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_24` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_25` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_26` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_27` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_28` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_29` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_30` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_31` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_32` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_33` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_34` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_35` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_36` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_37` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_38` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_39` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_40` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_41` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_42` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_43` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_44` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_45` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_46` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_47` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_48` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_49` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_50` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_51` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_52` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_53` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_54` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_55` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_56` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_57` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_58` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_59` (`codigoCupon`),
  UNIQUE KEY `codigoCupon_60` (`codigoCupon`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupones`
--

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
INSERT INTO `cupones` VALUES (4,'10% off para Sharulovers','SHARULOVE10',10,1),(5,'Descuento del 20%','SHARU20',20,1);
/*!40000 ALTER TABLE `cupones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idProducto` int NOT NULL,
  `texto` text NOT NULL,
  `idUsuario` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProducto` (`idProducto`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `mensajes_ibfk_3` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_4` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES (1,10,'Mensaje de prueba',21,'2025-10-09 18:06:23','2025-10-09 18:06:23'),(2,8,'Hola, estoy probando!',21,'2025-10-09 18:59:26','2025-10-09 18:59:26'),(3,20,'Este es un mensaje de prueba',21,'2025-10-09 19:03:30','2025-10-09 19:03:30'),(4,20,'Este es un mensaje de prueba',21,'2025-10-09 19:03:51','2025-10-09 19:03:51'),(5,20,'Mensaje de prueba con Nodemailer',21,'2025-10-09 19:07:07','2025-10-09 19:07:07'),(6,6,'Hola, hacen envío a Santiago del Estero? ',23,'2025-10-17 17:54:51','2025-10-17 17:54:51'),(7,39,'Hola, hacen envíos al interior del país? Soy de San Juan. ',21,'2025-10-31 17:26:33','2025-10-31 17:26:33'),(8,33,'Hola, venden el producto por caja cerrada? ',23,'2025-10-31 17:35:52','2025-10-31 17:35:52'),(9,39,'Hola, Ya recibi mi producto ♥',21,'2025-11-03 20:02:15','2025-11-03 20:02:15');
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes_backup`
--

DROP TABLE IF EXISTS `mensajes_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes_backup` (
  `id` int NOT NULL DEFAULT '0',
  `texto` text NOT NULL,
  `idProducto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes_backup`
--

LOCK TABLES `mensajes_backup` WRITE;
/*!40000 ALTER TABLE `mensajes_backup` DISABLE KEYS */;
INSERT INTO `mensajes_backup` VALUES (1,'Mensaje de prueba',6);
/*!40000 ALTER TABLE `mensajes_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `monto` float NOT NULL,
  `fecha` datetime NOT NULL,
  `metodoPago` varchar(255) NOT NULL,
  `estadoPago` enum('pendiente','completado','fallido') NOT NULL,
  `idPedido` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idPedido` (`idPedido`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,9600,'2025-09-08 00:00:00','Mercado Pago','pendiente',17);
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` enum('activo','cerrado','cancelado') NOT NULL,
  `idUsuario` int NOT NULL COMMENT 'Usuario que realizo la compra',
  `idCuponDescuento` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT '0.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idCuponDescuento` (`idCuponDescuento`),
  CONSTRAINT `pedidos_ibfk_328` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ibfk_329` FOREIGN KEY (`idCuponDescuento`) REFERENCES `cupones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (5,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(6,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(7,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(8,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(9,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(10,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(11,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(12,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(13,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(14,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(15,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(16,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(17,'activo',10,NULL,0.00,'2025-09-09 18:58:13','2025-09-09 18:58:24'),(18,'activo',21,NULL,10600.00,'2025-10-09 15:09:08','2025-10-09 15:09:08'),(19,'activo',21,NULL,6000.00,'2025-10-14 20:02:38','2025-10-14 20:02:38'),(20,'activo',21,NULL,11100.00,'2025-10-31 17:26:50','2025-10-31 17:26:50'),(21,'activo',23,NULL,11100.00,'2025-11-03 19:58:24','2025-11-03 19:58:24'),(22,'activo',21,NULL,8325.00,'2025-11-03 20:01:51','2025-11-03 20:01:51');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidosxproductos`
--

DROP TABLE IF EXISTS `pedidosxproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidosxproductos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precioUnitario` float NOT NULL,
  `subtotal` decimal(10,0) NOT NULL,
  `idPedido` int NOT NULL,
  `idProducto` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idPedido` (`idPedido`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `pedidosxproductos_ibfk_259` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedidosxproductos_ibfk_260` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidosxproductos`
--

LOCK TABLES `pedidosxproductos` WRITE;
/*!40000 ALTER TABLE `pedidosxproductos` DISABLE KEYS */;
INSERT INTO `pedidosxproductos` VALUES (13,2,4800,9600,17,6),(14,2,4800,9600,17,6),(15,1,6000,6000,18,20),(16,1,4600,4600,18,10),(17,1,6000,6000,19,20),(18,1,5500,5500,20,38),(19,1,5600,5600,20,37),(20,1,5500,5500,21,38),(21,1,5600,5600,21,37),(22,1,4500,4500,22,28),(23,1,3825,3825,22,27);
/*!40000 ALTER TABLE `pedidosxproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `imagenUrl` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `precio` float NOT NULL,
  `stock` int NOT NULL,
  `fechaAlta` datetime NOT NULL,
  `oferta` tinyint(1) NOT NULL DEFAULT '0',
  `descuento` int DEFAULT '0',
  `cuitProveedor` bigint DEFAULT NULL,
  `idCategoria` int DEFAULT NULL,
  `idUsuario` int NOT NULL,
  `idAdministrador` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `cuitProveedor` (`cuitProveedor`),
  KEY `idCategoria` (`idCategoria`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `productos_ibfk_683` FOREIGN KEY (`cuitProveedor`) REFERENCES `proveedores` (`cuit`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_684` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_685` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_686` FOREIGN KEY (`idAdministrador`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (6,'Merlot Rosado','El Merlot rosado es un vino ligero y fresco, con un color rosado pálido y delicado, con notas aromáticas de frutos rojos como fresas y cerezas y, a menudo, flores.','/uploads/productos/portadas/1761919001752-6pi8fk.png',4,4800,8,'2025-06-19 00:00:00',0,0,NULL,2,9,NULL,1),(8,'Vino Syrah','Con cuerpo medio a completo, con notas de pimienta negra y frutos negros.','/uploads/productos/portadas/1761918846762-yf8aay.png',NULL,5300,10,'2025-09-10 21:19:45',0,0,NULL,3,9,NULL,1),(10,'Sauvignon Blanc','El sauvignon blanc es un vino blanco reconocido por su frescura, viveza y expresividad.','/uploads/productos/portadas/1761920374182-vbhjgy.png',NULL,5000,15,'2025-09-11 14:00:17',1,0,NULL,46,9,NULL,1),(20,'Chardonnay','El chardonnay es una uva blanca de piel verde originaria de Borgoña, Francia. Se utiliza para producir vino blancos versátiles y de cuerpo medio completo.','/uploads/productos/portadas/1761918639494-a7sllw.png',NULL,6000,6,'2025-10-06 21:12:29',1,0,NULL,4,9,NULL,1),(21,'Cabernet Sauvignon','El Cabernet es una uva de piel oscura, originaria de Burdeos, Francia, que produce vinos tintos de cuerpo intenso, alto tanino y gran capacidad de envejecimiento.','/uploads/productos/portadas/1761918544691-zgm0h7.png',NULL,5000,6,'2025-10-14 20:09:14',1,10,NULL,4,9,NULL,1),(27,'Torrontés ','El torrontés es una uva blanca, emblema de Argentina, que produce vinos blancos secos o dulces muy aromáticos, con notas de flores blancas, cítricos y frutas de carozo.','/uploads/productos/portadas/1761918768228-9cagjr.png',NULL,4500,10,'2025-10-31 13:52:48',0,15,NULL,4,9,NULL,1),(28,'Moscato','El moscato es un vino dulce y afrutado, conocido por sus intensos aromas florales (como jazmín, rosa y flor de azahar) y de frutas. ','/uploads/productos/portadas/1761920070047-ytmpi5.png',NULL,4500,10,'2025-10-31 14:14:30',0,0,NULL,4,9,NULL,1),(29,'Pinot Gris','La Pinot Gris es una uva de vino blanco de origen francés, conocida como Pinot Grigio en Italia, con racimos de color azul-grisáceo que pueden presentar tonos rosados o blanquecinos. ','/uploads/productos/portadas/1761920186118-nwihun.png',NULL,5000,10,'2025-10-31 14:16:26',0,0,NULL,4,9,NULL,1),(30,'Verdejo',' El verdejo es una variedad de uva blanca autóctona de España, principalmente de la zona de Rueda, conocida por producir vinos blancos con un característico toque amargo final y aromas frutales, herbáceos y florales.','/uploads/productos/portadas/1761920308498-urqhz9.png',NULL,5200,15,'2025-10-31 14:18:28',1,0,NULL,4,9,NULL,1),(31,'Cabernet Sauvignon Reserva','Cuerpo y sabor: Es un vino con cuerpo completo, seco y con taninos altos que le dan una sensación astringente. ','/uploads/productos/portadas/1761920736272-ymv7if.png',NULL,4800,20,'2025-10-31 14:25:36',0,5,NULL,3,9,NULL,1),(32,'Merlot',' El Merlot es un vino tinto reconocido por su suavidad y perfil afrutado, con taninos suaves y acidez moderada.','/uploads/productos/portadas/1761920785688-f5f6va.png',NULL,4500,20,'2025-10-31 14:26:25',0,0,NULL,3,9,NULL,1),(33,'Tempranillo','El tempranillo es una uva de vino tinto español de piel gruesa y color negro azulado, famosa por producir vinos de color rojo rubí a granate, con aromas afrutados.','/uploads/productos/portadas/1761920845806-84u6ou.png',NULL,5200,10,'2025-10-31 14:27:25',0,0,NULL,3,9,NULL,1),(34,'Pinot Noir','Pinot Noir es una uva de vino tinto de piel fina y fina que produce vinos ligeros a medios con alta acidez, taninos bajos y sabores a frutas rojas como cereza, frambuesa y fresa.','/uploads/productos/portadas/1761920948808-1bm3m6.png',NULL,5800,10,'2025-10-31 14:29:08',1,0,NULL,3,9,NULL,1),(35,'Malbec',' Malbec es un vino tinto de cuerpo medio a completo, conocido por sus intensos sabores afrutados y aterciopelados, y sus taninos suaves.','/uploads/productos/portadas/1761930850437-k863i6.png',NULL,4800,15,'2025-10-31 14:29:52',0,0,NULL,3,9,NULL,1),(36,'Merlot Rosé','El Merlot rosado es un vino afrutado, fresco y sedoso, con un color que va del rosa pálido al rosa frambuesa. ','/uploads/productos/portadas/1761921076128-o1cw0h.png',NULL,5200,18,'2025-10-31 14:31:16',0,10,NULL,2,9,NULL,1),(37,'Pinot Noir Rosado','Un vino rosado de Pinot Noir es un vino ligero y fresco, con un color rosado pálido y delicado, y notas aromáticas de frutos rojos como fresas y cerezas, y a menudo flores.','/uploads/productos/portadas/1761921121657-scf9xz.png',NULL,5600,12,'2025-10-31 14:32:01',0,0,NULL,2,9,NULL,0),(38,'Malbec Rosé','El Malbec rosado es un vino fresco, frutal y joven, ideal para el día a día. Destaca por su color rosa o salmón, aromas a frutas rojas (fresas, frambuesas, cerezas) y toques florales o de frutos del bosque.','/uploads/productos/portadas/1761921179945-fs8rc6.png',NULL,5500,12,'2025-10-31 14:32:59',0,0,NULL,2,9,NULL,1),(39,'Syrah Rosé','Un vino Syrah rosado se caracteriza por su color rosa tenue a salmón, aromas a frutos rojos (fresa, cereza, frambuesa) y toques florales, y un sabor fresco y jugoso con un final equilibrado y persistente.','/uploads/productos/portadas/1761921545208-k92le5.png',NULL,4600,12,'2025-10-31 14:39:05',0,0,NULL,2,9,NULL,1),(40,'Cabernet Sauvignon Rosé','Pueden presentarse como vinos rosados pálidos, que suelen tener notas frutales más delicadas, o como rosados más oscuros e intensos.','/uploads/productos/portadas/1761930748260-fnzhck.png',NULL,5000,18,'2025-10-31 17:12:28',0,10,NULL,2,9,NULL,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `cuit` bigint NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `idUsuario` int DEFAULT NULL,
  `idAdministrador` int DEFAULT NULL,
  PRIMARY KEY (`cuit`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `proveedores_ibfk_230` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `proveedores_ibfk_231` FOREIGN KEY (`idAdministrador`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (30254536127,'Rolando Rivas','1145987852','rolandorivas@test.com','Terrero 361',NULL,NULL),(31987456123,'Bodegas Nieto','1125879631','atencionalcliente@bodegasnieto.com','Sargento Cabral 21, Pcia. Mendoza',NULL,NULL);
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `codigo_2` (`codigo`),
  UNIQUE KEY `codigo_3` (`codigo`),
  UNIQUE KEY `codigo_4` (`codigo`),
  UNIQUE KEY `codigo_5` (`codigo`),
  UNIQUE KEY `codigo_6` (`codigo`),
  UNIQUE KEY `codigo_7` (`codigo`),
  UNIQUE KEY `codigo_8` (`codigo`),
  UNIQUE KEY `codigo_9` (`codigo`),
  UNIQUE KEY `codigo_10` (`codigo`),
  UNIQUE KEY `codigo_11` (`codigo`),
  UNIQUE KEY `codigo_12` (`codigo`),
  UNIQUE KEY `codigo_13` (`codigo`),
  UNIQUE KEY `codigo_14` (`codigo`),
  UNIQUE KEY `codigo_15` (`codigo`),
  UNIQUE KEY `codigo_16` (`codigo`),
  UNIQUE KEY `codigo_17` (`codigo`),
  UNIQUE KEY `codigo_18` (`codigo`),
  UNIQUE KEY `codigo_19` (`codigo`),
  UNIQUE KEY `codigo_20` (`codigo`),
  UNIQUE KEY `codigo_21` (`codigo`),
  UNIQUE KEY `codigo_22` (`codigo`),
  UNIQUE KEY `codigo_23` (`codigo`),
  UNIQUE KEY `codigo_24` (`codigo`),
  UNIQUE KEY `codigo_25` (`codigo`),
  UNIQUE KEY `codigo_26` (`codigo`),
  UNIQUE KEY `codigo_27` (`codigo`),
  UNIQUE KEY `codigo_28` (`codigo`),
  UNIQUE KEY `codigo_29` (`codigo`),
  UNIQUE KEY `codigo_30` (`codigo`),
  UNIQUE KEY `codigo_31` (`codigo`),
  UNIQUE KEY `codigo_32` (`codigo`),
  UNIQUE KEY `codigo_33` (`codigo`),
  UNIQUE KEY `codigo_34` (`codigo`),
  UNIQUE KEY `codigo_35` (`codigo`),
  UNIQUE KEY `codigo_36` (`codigo`),
  UNIQUE KEY `codigo_37` (`codigo`),
  UNIQUE KEY `codigo_38` (`codigo`),
  UNIQUE KEY `codigo_39` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'1','admin','2025-08-21 16:36:24','2025-08-21 16:36:24'),(2,'2','cliente','2025-08-21 16:36:24','2025-08-21 16:36:24'),(3,'3','vendedor','2025-08-21 16:36:24','2025-08-21 16:36:24');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `fechaRegistro` datetime NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `localidad` varchar(255) DEFAULT NULL,
  `codigoPostal` varchar(10) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `idRol` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `updatedAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `proveedor` varchar(255) NOT NULL DEFAULT 'local',
  `proveedorId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  KEY `idRol` (`idRol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'Andrea','Lopez','12345678','andrea@test.com','2025-09-11 18:45:00',NULL,NULL,NULL,NULL,'123456',2,1,'2025-10-31 17:19:57','2025-09-11 18:28:40','local',NULL),(10,'Christopher','Ashton','','cjashton@gmail.com','2025-09-11 18:37:00',NULL,'Hereford',NULL,NULL,'987654',2,0,'2025-09-29 23:05:58','2025-09-11 18:28:40','local',NULL),(18,'Daniela','Lopez',NULL,'daniela@test.com','2025-09-23 18:56:00',NULL,NULL,NULL,NULL,'$2b$10$jGbcMf7Qnr4vfr.F94174eNmlQi6xu8rSzDleQWot3/sFM.3cOI0a',1,1,'2025-10-22 14:26:02','2025-09-23 18:56:04','local',NULL),(20,'Andrea','Lopez',NULL,'andhy.lopez.090@gmail.com','2025-09-25 16:13:00',NULL,NULL,NULL,NULL,'$2b$10$VwGT00GTaCQkYx9JN8fu2eRHntuI0AvWoAGiF7qXT1o5AD1ilxuz6',3,1,'2025-10-31 14:04:38','2025-09-25 16:13:43','google','101304364824822423245'),(21,'Ana','Lopez',NULL,'ana@test.com','2025-09-30 00:18:08',NULL,NULL,NULL,NULL,'$2b$10$NsOm3J9b8X1o1Q.5x3h08.8cS4BD4JdiKWmRJzoZETDJ0Gtj3GGoa',2,1,'2025-09-30 00:18:08','2025-09-30 00:18:08','local',NULL),(22,'Antonio','Lopez',NULL,'antonio@test.com','2025-09-30 21:13:49',NULL,NULL,NULL,NULL,'$2b$10$MZK.y1./FRcmxA6IvNsIouy47Wp0YvQv1GTumK932xwcDgstyCjIu',2,0,'2025-10-31 14:04:46','2025-09-30 21:13:49','local',NULL),(23,'Andrea ','Lopez',NULL,'andrecmyname@gmail.com','2025-09-30 21:15:00',NULL,NULL,NULL,NULL,'$2b$10$0S3wP0/TYaCFqTHGD/bPneAPqUYcHh6RqEYekB6wys2Cz7XF.zWv2',3,1,'2025-11-03 20:03:43','2025-09-30 21:15:28','google','112837692748426768453');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-04 18:00:10
