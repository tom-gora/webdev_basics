-- phpMyAdmin SQL Dump
-- version 5.2.1-4.fc40
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 07, 2024 at 09:15 AM
-- Server version: 10.11.6-MariaDB
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `phonezone`
--

-- --------------------------------------------------------

--
-- Table structure for table `hero_contents`
--

CREATE TABLE `hero_contents` (
  `hero_content_id` int(11) NOT NULL,
  `hero_card_title` varchar(255) NOT NULL,
  `hero_card_subtitle` varchar(255) DEFAULT NULL,
  `hero_description` text DEFAULT NULL,
  `hero_card_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `hero_contents`
--

INSERT INTO `hero_contents` (`hero_content_id`, `hero_card_title`, `hero_card_subtitle`, `hero_description`, `hero_card_img`) VALUES
(1, 'Win a free phone', 'Get Lucky: Be the 100th Customer and Win a Free Phone!', 'Only in INSERT_MONTH! Every 100th purchasing customer wins a free phone. Shop with us for your chance to take home a brand new phone at no cost. Visit today and see if you’re our next lucky winner!', 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwcGhvbmV8ZW58MHwxfDB8fHwy&'),
(2, 'Smartphone of the month', 'Exclusive Offer: The Latest INSERT_PHONE at an Unbeatable Price!', 'Discover the power of INSERT_PHONE this INSERT_MONTH! Enjoy special discounts and promotions all month long. Don’t miss out on this exclusive offer – upgrade to the INSERT_PHONE today and experience innovation at its finest!', 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(3, 'Limited Time Offer', 'Huge Discounts on Select Phones!', 'This INSERT_MONTH, enjoy incredible savings on our top-selling smartphones. Hurry, these deals won\'t last long. Visit our store now and get up to 50% off on select models. Don\'t miss out!', 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?q=80&w=1410&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(4, 'New Arrivals', 'Check Out the Latest Phones', 'Stay ahead of the tech curve with our latest arrivals. From the newest INSERT_PHONE to other cutting-edge devices, find the perfect phone that meets your needs. Explore our new collection this INSERT_MONTH and upgrade to the latest technology!', 'https://images.unsplash.com/photo-1624006930534-15f969856847?q=80&w=1318&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(5, 'Our New Trade-In Program', 'Upgrade Your Phone for Less', 'Thinking about upgrading? Trade in your old phone and get a credit towards a new INSERT_PHONE. This INSERT_MONTH, take advantage of our best trade-in deals and make your upgrade more affordable. Visit us today to find out how much your old phone is worth!', 'https://images.pexels.com/photos/8067877/pexels-photo-8067877.jpeg?auto=compress&cs=tinysrgb&w=600');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hero_contents`
--
ALTER TABLE `hero_contents`
  ADD PRIMARY KEY (`hero_content_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hero_contents`
--
ALTER TABLE `hero_contents`
  MODIFY `hero_content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;
