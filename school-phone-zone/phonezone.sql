-- phpMyAdmin SQL Dump
-- version 5.2.1-4.fc40
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 31, 2024 at 06:03 PM
-- Server version: 10.11.6-MariaDB
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phonezone`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart_state_store`
--

CREATE TABLE `cart_state_store` (
  `user_id` int(11) NOT NULL,
  `order_contents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`order_contents`)),
  `state_save_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_state_store`
--

INSERT INTO `cart_state_store` (`user_id`, `order_contents`, `state_save_timestamp`) VALUES
(2, '{\"products\":[{\"product_id\":26,\"product_amount\":1},{\"product_id\":28,\"product_amount\":2}]}', '2024-05-31 17:01:49');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_hash_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `order_contents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order_contents`)),
  `user_id` int(11) DEFAULT NULL,
  `order_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_hash_number`, `order_contents`, `user_id`, `order_timestamp`) VALUES
(1, '0002-8fb76f5f', '{\"products\":[{\"product_id\":12,\"product_amount\":1}]}', 2, '2024-05-29 15:18:20'),
(2, '0002-36494fb3', '{\"products\":[{\"product_id\":48,\"product_amount\":2},{\"product_id\":44,\"product_amount\":1}]}', 2, '2024-05-29 15:20:55'),
(3, '0002-7a2f8998', '{\"products\":[{\"product_id\":46,\"product_amount\":1},{\"product_id\":22,\"product_amount\":2}]}', 2, '2024-05-31 15:33:45'),
(4, '0001-0cf4d638', '{\"products\":[{\"product_id\":3,\"product_amount\":1}]}', 1, '2024-05-31 17:51:26');

--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `before_insert_order` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE random_string CHAR(8);
    SET random_string = LEFT(MD5(RAND()), 8);
    SET NEW.order_hash_number = CONCAT(LPAD(NEW.user_id, 4, '0'), '-', random_string);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_img_path` varchar(255) NOT NULL,
  `product_price` int(11) NOT NULL,
  `product_brand` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_img_path`, `product_price`, `product_brand`) VALUES
(1, 'Samsung Galaxy S21', 'galaxy_s21.png', 799, 'Samsung'),
(2, 'iPhone 13 Pro', 'iphone_13_pro.png', 999, 'Apple'),
(3, 'Google Pixel 6', 'pixel_6.png', 699, 'Google'),
(4, 'OnePlus 9', 'oneplus_9.png', 699, 'OnePlus'),
(5, 'Xiaomi Mi 11', 'mi_11.png', 699, 'Xiaomi'),
(6, 'Samsung Galaxy A52', 'galaxy_a52.png', 349, 'Samsung'),
(7, 'iPhone SE (2020)', 'iphone_se_2020.png', 399, 'Apple'),
(8, 'Google Pixel 5a', 'pixel_5a.png', 449, 'Google'),
(9, 'OnePlus Nord CE', 'oneplus_nord_ce.png', 299, 'OnePlus'),
(10, 'Xiaomi Redmi Note 10', 'redmi_note_10.png', 249, 'Xiaomi'),
(11, 'Samsung Galaxy Z Fold 3', 'galaxy_z_fold_3.png', 1799, 'Samsung'),
(12, 'iPhone 12 Mini', 'iphone_12_mini.png', 699, 'Apple'),
(13, 'Google Pixel 6 Pro', 'pixel_6_pro.png', 899, 'Google'),
(14, 'OnePlus 9 Pro', 'oneplus_9_pro.png', 899, 'OnePlus'),
(15, 'Xiaomi Mi 11 Lite', 'mi_11_lite.png', 349, 'Xiaomi'),
(16, 'Samsung Galaxy S23', 'galaxy_s23.png', 799, 'Samsung'),
(17, 'iPhone 14', 'iphone_14.png', 1099, 'Apple'),
(18, 'Google Pixel 7', 'pixel_7.png', 599, 'Google'),
(19, 'OnePlus 10', 'oneplus_10.png', 999, 'OnePlus'),
(20, 'Xiaomi Poco X4', 'poco_x4.png', 299, 'Xiaomi'),
(21, 'iPhone 15', 'iphone_15.png', 1000, 'Apple'),
(22, 'Samsung Galaxy S24', 'galaxy_s24.png', 1050, 'Samsung'),
(23, 'Pixel 8', 'pixel_8.png', 850, 'Google'),
(24, 'Honor 50', 'Honor50.png', 380, 'Honor'),
(25, 'Samsung Galaxy S24 Ultra', 'galaxy_s24_ultra.png', 1299, 'Samsung'),
(26, 'iPhone 15 Pro Max', 'iphone_15_pro_max.png', 1199, 'Apple'),
(27, 'Google Pixel 8 Pro', 'pixel_8_pro.png', 999, 'Google'),
(28, 'OnePlus 12', 'oneplus_12.png', 899, 'OnePlus'),
(29, 'Xiaomi Mi 13', 'mi_13.png', 799, 'Xiaomi'),
(30, 'Oppo Find X7', 'find_x7.png', 1050, 'Oppo'),
(31, 'Sony Xperia 1 V', 'xperia_1_v.png', 1199, 'Sony'),
(32, 'Vivo X90 Pro', 'vivo_x90_pro.png', 950, 'Vivo'),
(33, 'Huawei P60 Pro', 'p60_pro.png', 1099, 'Huawei'),
(34, 'Realme GT3', 'realme_gt3.png', 550, 'Realme'),
(35, 'Motorola Razr 2024', 'motorola_razr_2024.png', 1399, 'Motorola'),
(36, 'Asus ROG Phone 7', 'rog_phone_7.png', 999, 'Asus'),
(37, 'Nokia XR21', 'nokia_xr21.png', 499, 'Nokia'),
(38, 'Fairphone 5', 'fairphone_5.png', 699, 'Fairphone'),
(39, 'TCL 30 Pro 5G', 'tcl_30_pro_5g.png', 599, 'TCL'),
(40, 'Samsung Galaxy Z Fold 5', 'galaxy_z_fold_5.png', 1799, 'Samsung'),
(41, 'iPhone 14 Pro', 'iphone_14_pro.png', 1199, 'Apple'),
(42, 'Google Pixel 8a', 'pixel_8a.png', 499, 'Google'),
(43, 'OnePlus Nord 4', 'oneplus_nord_4.png', 399, 'OnePlus'),
(44, 'Xiaomi Redmi Note 13', 'redmi_note_13.png', 299, 'Xiaomi'),
(45, 'Oppo Reno 9 Pro', 'reno_9_pro.png', 649, 'Oppo'),
(46, 'Sony Xperia 10 V', 'xperia_10_v.png', 699, 'Sony'),
(47, 'Vivo V27', 'vivo_v27.png', 599, 'Vivo'),
(48, 'Huawei Nova 11', 'nova_11.png', 499, 'Huawei'),
(49, 'Realme 10 Pro+', 'realme_10_pro_plus.png', 450, 'Realme'),
(50, 'Motorola Edge 40', 'motorola_edge_40.png', 699, 'Motorola');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_registration` date DEFAULT NULL,
  `user_firstname` varchar(50) NOT NULL,
  `user_lastname` varchar(50) NOT NULL,
  `user_password` varchar(32) DEFAULT NULL,
  `user_img` varchar(255) DEFAULT NULL,
  `user_type` enum('admin','user','owner') NOT NULL,
  `user_auth_method` enum('1','2','3') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_registration`, `user_firstname`, `user_lastname`, `user_password`, `user_img`, `user_type`, `user_auth_method`) VALUES
(1, 'tom.gora@example.com', '2024-05-02', 'Tom', 'Gora', '202cb962ac59075b964b07152d234b70', '8953814656_.jpg', 'owner', '1'),
(2, 'jason.smith@example.com', '2023-02-14', 'Jason', 'Smith', '202cb962ac59075b964b07152d234b70', '1533543571.jpg', 'user', '1'),
(3, 'martin.clarke@example.com', '2022-10-02', 'Martin', 'Clarke', '202cb962ac59075b964b07152d234b70', '8234179893.jpg', 'admin', '1'),
(4, 'william.jones@example.com', '2022-04-09', 'William', 'Jones', '202cb962ac59075b964b07152d234b70', '7125447430.jpg', 'user', '1'),
(5, 'elizabeth.taylor@example.com', '2023-02-03', 'Elizabeth', 'Taylor', '202cb962ac59075b964b07152d234b70', '4496470162.jpg', 'user', '1'),
(6, 'george.brown@example.com', '2022-04-12', 'George', 'Brown', '202cb962ac59075b964b07152d234b70', '1871178540.jpg', 'user', '1'),
(7, 'emily.evans@example.com', '2024-03-27', 'Emily', 'Evans', '202cb962ac59075b964b07152d234b70', '8089207608.jpg', 'user', '1'),
(8, 'oliver.hall@example.com', '2023-09-25', 'Oliver', 'Hall', '202cb962ac59075b964b07152d234b70', '6995665583.jpg', 'user', '1'),
(9, 'amelia.hill@example.com', '2023-10-30', 'Amelia', 'Hill', '202cb962ac59075b964b07152d234b70', '4004785154.jpg', 'user', '1'),
(10, 'charlie.murphy@example.com', '2023-09-14', 'Charlie', 'Murphy', '202cb962ac59075b964b07152d234b70', '5472276882.jpg', 'user', '1'),
(11, 'lucy.wilson@example.com', '2022-10-13', 'Lucy', 'Wilson', '202cb962ac59075b964b07152d234b70', '4574769928.jpg', 'user', '1'),
(12, 'tomano.g@gmail.com', '2024-04-14', 'Tomasz', 'GÃ³ra', '', '7830222464.jpg', 'admin', '2'),
(13, 'goratomasz@outlook.com', '2024-04-29', 'Tomasz', 'Gora', NULL, '3465088754.jpg', 'user', '3'),
(14, 'przypinki.pinmedown@gmail.com', '2024-04-29', 'Tomasz', 'GÃ³ra', NULL, '1507447401.jpg', 'user', '2');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `limit_users` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
    DECLARE users_cnt INT;
    SELECT COUNT(*) INTO users_cnt FROM users;
    IF users_cnt > 30 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'limit_reached';
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_state_store`
--
ALTER TABLE `cart_state_store`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_state_store`
--
ALTER TABLE `cart_state_store`
  ADD CONSTRAINT `cart_state_store_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
