-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 12, 2026 at 01:59 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kelompok1_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking_services`
--

CREATE TABLE `booking_services` (
  `id` int NOT NULL,
  `reg_no` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `customer_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `total_price` int NOT NULL DEFAULT '0',
  `notes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `address_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking_services`
--

INSERT INTO `booking_services` (`id`, `reg_no`, `status`, `customer_id`, `booking_date`, `booking_time`, `total_price`, `notes`, `createdAt`, `updatedAt`, `address_id`) VALUES
(1, 'BK-20261012-1001', 'completed', 1, '2026-10-25', '09:00:00', 265000, NULL, '2026-10-12 01:34:39', '2026-10-12 01:56:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `booking_units`
--

CREATE TABLE `booking_units` (
  `id` int NOT NULL,
  `brand_ac` varchar(255) NOT NULL,
  `type_ac` varchar(255) NOT NULL,
  `pk` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `keluhan` text,
  `price` int NOT NULL,
  `booking_id` int NOT NULL,
  `service_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking_units`
--

INSERT INTO `booking_units` (`id`, `brand_ac`, `type_ac`, `pk`, `lokasi`, `keluhan`, `price`, `booking_id`, `service_id`, `createdAt`, `updatedAt`) VALUES
(3, 'Daikin', 'Split', '1', 'Kamar Depan', 'Cuci rutin', 90000, 1, 1, '2026-10-12 01:56:26', '2026-10-12 01:56:26'),
(4, 'Panasonic', 'Split', '1/2', 'Kamar Belakang', 'Kurang dingin', 175000, 1, 2, '2026-10-12 01:56:26', '2026-10-12 01:56:26');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Service AC', '2026-10-12 01:33:17', '2026-10-12 01:33:17'),
(2, 'Perbaikan AC', '2026-10-12 01:33:17', '2026-10-12 01:33:17'),
(3, 'Bongkar Pasang AC', '2026-10-12 01:33:17', '2026-10-12 01:33:17');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `createdAt`, `updatedAt`) VALUES
(1, 'Budi Pratama', '081234567801', '2026-10-12 01:34:15', '2026-10-12 01:34:15'),
(2, 'Siti Rahma', '081234567802', '2026-10-12 01:34:15', '2026-10-12 01:34:15');

-- --------------------------------------------------------

--
-- Table structure for table `customer_addresses`
--

CREATE TABLE `customer_addresses` (
  `id` int NOT NULL,
  `customer_id` int NOT NULL,
  `label` varchar(255) NOT NULL DEFAULT 'Alamat Utama',
  `address` text NOT NULL,
  `notes_location` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customer_addresses`
--

INSERT INTO `customer_addresses` (`id`, `customer_id`, `label`, `address`, `notes_location`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Rumah', 'Jl. Sudirman No. 10', 'Pagar hitam', '2026-10-12 01:34:15', '2026-10-12 01:34:15'),
(2, 1, 'Kantor', 'Jl. Thamrin Kav 5', 'Lt 3', '2026-10-12 01:34:15', '2026-10-12 01:34:15'),
(3, 2, 'Rumah Utama', 'Jl. Gatot Subroto No. 44', NULL, '2026-10-12 01:34:15', '2026-10-12 01:34:15');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `stock` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `category_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `category_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Service AC Biasa', 'Pemberisihan standar', 90000, 1, '2026-10-12 01:33:29', '2026-10-12 01:33:29'),
(2, 'Service AC Extra (Cuci Steam)', 'Cuci steam menyeluruh', 175000, 1, '2026-10-12 01:33:29', '2026-10-12 01:33:29'),
(3, 'Perbaikan Kapasitor', 'Ganti kapasitor baru', 250000, 2, '2026-10-12 01:33:29', '2026-10-12 01:33:29'),
(4, 'Bongkar AC', 'Bongkar unit AC', 150000, 3, '2026-10-12 01:33:29', '2026-10-12 01:33:29'),
(5, 'Pasang AC', 'Pasang unit AC', 250000, 3, '2026-10-12 01:33:29', '2026-10-12 01:33:29');

-- --------------------------------------------------------

--
-- Table structure for table `technicians`
--

CREATE TABLE `technicians` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `technicians`
--

INSERT INTO `technicians` (`id`, `name`, `phone`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Budi Santoso', '081212121211', 'active', '2026-10-12 01:33:43', '2026-10-12 01:33:43'),
(2, 'Agus Wijaya', '081212121212', 'active', '2026-10-12 01:33:43', '2026-10-12 01:33:43'),
(3, 'Rina Marlina', '081212121213', 'inactive', '2026-10-12 01:33:43', '2026-10-12 01:33:43');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `booking_id` int NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `payment_method` enum('cash','transfer_bank','qris') NOT NULL,
  `amount_paid` int NOT NULL DEFAULT '0',
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `payment_date` datetime NOT NULL,
  `notes` text,
  `created_by` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `booking_id`, `invoice_no`, `payment_method`, `amount_paid`, `payment_status`, `payment_date`, `notes`, `created_by`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'INV-202610-8721', 'cash', 265000, 'paid', '2026-10-12 01:53:29', NULL, 1, '2026-10-12 01:53:29', '2026-10-12 01:53:29'),
(2, 1, 'INV-202610-4598', 'cash', 265000, 'paid', '2026-10-12 01:53:32', NULL, 1, '2026-10-12 01:53:32', '2026-10-12 01:53:32'),
(3, 1, 'INV-202610-2820', 'cash', 265000, 'paid', '2026-10-12 01:53:40', NULL, 1, '2026-10-12 01:53:40', '2026-10-12 01:53:40'),
(4, 1, 'INV-202610-4308', 'cash', 265000, 'paid', '2026-10-12 01:53:43', NULL, 1, '2026-10-12 01:53:43', '2026-10-12 01:53:43'),
(5, 1, 'INV-202610-6792', 'cash', 265000, 'paid', '2026-10-12 01:53:46', NULL, 1, '2026-10-12 01:53:46', '2026-10-12 01:53:46'),
(6, 1, 'INV-202610-5230', 'cash', 265000, 'paid', '2026-10-12 01:56:26', 'Pelunasan sisa tagihan edit booking', 1, '2026-10-12 01:56:26', '2026-10-12 01:56:26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `role` enum('admin','owner') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `status`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin Utama', 'admin@example.com', '$2b$10$6gzPxfbmXjWNSlMV9hhRIuXMhrXyFcCThN6Cw4s2daWPPVctMrEFm', '081234567890', 'active', 'admin', '2026-10-12 01:12:19', '2026-10-12 01:12:19'),
(2, 'Owner Utama', 'owner@example.com', '$2b$10$n/QlT4.UH/cH7X7cyplNB.2ttTkhF6TRx6zz.lhnX62FpG6XSwoD.', '081234567891', 'active', 'owner', '2026-10-12 01:12:19', '2026-10-12 01:12:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reg_no` (`reg_no`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `booking_units`
--
ALTER TABLE `booking_units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `technicians`
--
ALTER TABLE `technicians`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_no` (`invoice_no`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking_services`
--
ALTER TABLE `booking_services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booking_units`
--
ALTER TABLE `booking_units`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_services_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `customer_addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `booking_units`
--
ALTER TABLE `booking_units`
  ADD CONSTRAINT `booking_units_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_units_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD CONSTRAINT `customer_addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
