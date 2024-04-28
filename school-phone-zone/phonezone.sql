-- phpMyAdmin SQL Dump
-- version 5.2.1-2.fc39
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 04, 2024 at 05:33 PM
-- Server version: 10.5.23-MariaDB
-- PHP Version: 8.2.17

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
  `order_id` int(11) NOT NULL,
  `order_contents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order_contents`)),
  `user_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_contents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order_contents`)),
  `user_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_img_path` varchar(255) NOT NULL,
  `product_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_img_path`, `product_price`) VALUES
(1, 'Samsung Galaxy S21', 'galaxy_s21.png', 799),
(2, 'iPhone 13 Pro', 'iphone_13_pro.png', 999),
(3, 'Google Pixel 6', 'pixel_6.png', 699),
(4, 'OnePlus 9', 'oneplus_9.png', 699),
(5, 'Xiaomi Mi 11', 'mi_11.png', 699),
(6, 'Samsung Galaxy A52', 'galaxy_a52.png', 349),
(7, 'iPhone SE (2020)', 'iphone_se_2020.png', 399),
(8, 'Google Pixel 5a', 'pixel_5a.png', 449),
(9, 'OnePlus Nord CE', 'oneplus_nord_ce.png', 299),
(10, 'Xiaomi Redmi Note 10', 'redmi_note_10.png', 249),
(11, 'Samsung Galaxy Z Fold 3', 'galaxy_z_fold_3.png', 1799),
(12, 'iPhone 12 Mini', 'iphone_12_mini.png', 699),
(13, 'Google Pixel 6 Pro', 'pixel_6_pro.png', 899),
(14, 'OnePlus 9 Pro', 'oneplus_9_pro.png', 899),
(15, 'Xiaomi Mi 11 Lite', 'mi_11_lite.png', 349),
(16, 'Samsung Galaxy S23', 'galaxy_s23.png', 799),
(17, 'iPhone 14', 'iphone_14.png', 1099),
(18, 'Google Pixel 7', 'pixel_7.png', 599),
(19, 'OnePlus 10', 'oneplus_10.png', 999),
(20, 'Xiaomi Poco X4', 'poco_x4.png', 299),
(21, 'iPhone 15', 'iphone_15.png', 1000),
(22, 'Samsung Galaxy S24', 'galaxy_s24.png', 1050),
(23, 'Pixel 8', 'pixel_8.png', 850),
(24, 'Honor 50', 'Honor50.png', 380);

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
(1, 'tom.gora@example.com', '2024-03-25', 'Tom', 'Gora', '202cb962ac59075b964b07152d234b70', '1_tom_gora.jpg', 'owner', '1'),
(2, 'jason.smith@example.com', '2023-02-14', 'Jason', 'Smith', 'e10adc3949ba59abbe56e057f20f883e', '2_pennywise_smith.jpg', 'user', '1'),
(3, 'martin.clarke@example.com', '2022-10-02', 'Martin', 'Clarke', 'd41d8cd98f00b204e9800998ecf8427e', '3_martin_clarke.jpg', 'user', '1'),
(4, 'william.jones@example.com', '2022-04-09', 'William', 'Jones', '202cb962ac59075b964b07152d234b70', '4_william_jones.jpg', 'user', '1'),
(5, 'elizabeth.taylor@example.com', '2023-02-03', 'Elizabeth', 'Taylor', 'd41d8cd98f00b204e9800998ecf8427e', '5_elizabeth_taylor.jpg', 'user', '1'),
(6, 'george.brown@example.com', '2022-04-12', 'George', 'Brown', 'd41d8cd98f00b204e9800998ecf8427e', '6_george_brown.jpg', 'user', '1'),
(7, 'emily.evans@example.com', '2024-03-27', 'Emily', 'Evans', '202cb962ac59075b964b07152d234b70', '7_emily_evans.jpg', 'user', '1'),
(8, 'oliver.hall@example.com', '2023-09-25', 'Oliver', 'Hall', '202cb962ac59075b964b07152d234b70', '8_oliver_hall.jpg', 'user', '1'),
(9, 'amelia.hill@example.com', '2023-10-30', 'Amelia', 'Hill', '202cb962ac59075b964b07152d234b70', '9_amelia_hill.jpg', 'user', '1'),
(10, 'charlie.murphy@example.com', '2023-09-14', 'Charlie', 'Murphy', '202cb962ac59075b964b07152d234b70', '10_charlie_murphy.jpg', 'user', '1'),
(11, 'lucy.wilson@example.com', '2022-10-13', 'Lucy', 'Wilson', '202cb962ac59075b964b07152d234b70', '11_lucy_wilson.jpg', 'user', '1'),
(12, 'tomano.g@gmail.com', '2024-04-01', 'Tomasz', 'GÃ³ra', '', '12_tomasz_gora.jpg', 'admin', '2'),
(13, 'testuser1@example.com', '2024-03-25', 'Test', 'User1', '202cb962ac59075b964b07152d234b70', 'default.jpg', 'user', '1'),
(15, 'testuser3@example.com', '2022-10-02', 'Test', 'User3', '202cb962ac59075b964b07152d234b70', 'test3.jpg', 'user', '1'),
(16, 'testuser4@example.com', '2022-04-09', 'Test', 'User4', '202cb962ac59075b964b07152d234b70', 'test4.jpg', 'user', '1'),
(27, 'goratomasz@outlook.com', '2024-04-04', 'Tomasz', 'Gora', '', '27_tomasz_gora.jpg', 'user', '3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_state_store`
--
ALTER TABLE `cart_state_store`
  ADD PRIMARY KEY (`order_id`);

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
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_state_store`
--
ALTER TABLE `cart_state_store`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
