-- Maxwell Catalog Export
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- Table: brands (6 rows)
REPLACE INTO `brands` (`id`, `name`, `created_at`) VALUES (1, 'Western', '2026-10-15 17:23:46');
REPLACE INTO `brands` (`id`, `name`, `created_at`) VALUES (2, 'Hoshizaki', '2026-10-15 17:23:46');
REPLACE INTO `brands` (`id`, `name`, `created_at`) VALUES (3, 'Butler', '2026-10-15 17:23:46');
REPLACE INTO `brands` (`id`, `name`, `created_at`) VALUES (4, 'Maxsel', '2026-10-15 17:23:46');
REPLACE INTO `brands` (`id`, `name`, `created_at`) VALUES (5, 'Rational', '2026-10-15 17:23:46');
REPLACE INTO `brands` (`id`, `name`, `created_at`) VALUES (6, 'Unox', '2026-10-15 17:23:46');

-- Table: categories (18 rows)
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (1, 'Visi Cooler', 'visi-cooler', 'Capacity: 30 Liters – 1500 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (2, 'Stainless Steel Upright Products', 'stainless-steel-upright-products', 'Capacity: 600 Liters to 1800 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (3, 'Medical Refrigeration', 'medical-refrigeration', 'Capacity: 140 Liters to 500 Liters', 1, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (4, 'Deep Freezer', 'deep-freezer', 'Capacity: 70 Liters to 720 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (5, 'Stainless Steel Under Counters', 'stainless-steel-under-counters', 'Length: 700 mm to 1800 mm', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (6, 'Storage Water Cooler', 'storage-water-cooler', 'Capacity: 80 to 120 Liters', 1, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (7, 'Vertical Freezer', 'vertical-freezer', 'Capacity: 300 Liters to 950 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (8, 'Ice Machines', 'ice-machines', 'Capacity: 27 Kgs to 900 kgs', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (9, 'Ice Dispenser', 'ice-dispenser', 'Capacity: 110/230 cups/hour', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (10, 'Pastry Cabinet', 'pastry-cabinet', 'Length: 2 – 5 ft.', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (11, 'Back Bar', 'back-bar', 'Capacity: 226 Liters to 349 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (12, 'Supermarket Range', 'supermarket-range', 'Capacity: 935 to 1435 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (13, 'Golden Confectionery Cabinet', 'golden-confectionery-cabinet', 'Length: 3 – 5 ft', 1, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (14, 'Dishwasher', 'dishwasher', 'Capacity: 33 to 69 Basket per hour', 1, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (15, 'Vending Machine', 'vending-machine', 'Capacity: 1110 to 1150 Liters', 1, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (16, 'Preparation Table', 'preparation-table', 'Capacity: 272 Liters to 1000 Liters', 0, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (17, 'Glass Washer', 'glass-washer', 'Capacity: 18 to 33 Basket per hour', 1, '2026-10-15 15:32:48');
REPLACE INTO `categories` (`id`, `name`, `slug`, `capacity_note`, `is_new`, `created_at`) VALUES (18, 'Counter Top', 'counter-top', 'Compact Display & Cooler Units', 0, '2026-10-15 15:32:48');

-- Table: products (4 rows)
REPLACE INTO `products` (`id`, `model_no`, `name`, `brand`, `category_id`, `category_name`, `tags`, `image_url`, `brochure_url`, `is_featured`, `created_at`, `updated_at`) VALUES (3, 'VC-880-BLK', 'Velvet Covvered', 'Maxsel', NULL, 'Pastry Cabinet', 'Display, Confectionery, Luxury', '/products/velvet_covered_clean.png', '', 1, '2026-10-16 12:38:15', '2026-10-16 14:31:41');
REPLACE INTO `products` (`id`, `model_no`, `name`, `brand`, `category_id`, `category_name`, `tags`, `image_url`, `brochure_url`, `is_featured`, `created_at`, `updated_at`) VALUES (4, 'CG-500-ESP', 'Coffee grinder', 'Maxsel', NULL, 'Preparation Table', 'Espresso, Commercial, Grinder', '/products/mixer_product.png', '', 1, '2026-10-16 12:38:15', '2026-10-16 14:31:41');
REPLACE INTO `products` (`id`, `model_no`, `name`, `brand`, `category_id`, `category_name`, `tags`, `image_url`, `brochure_url`, `is_featured`, `created_at`, `updated_at`) VALUES (5, 'BB-3D-GLS', 'Back Bar', 'Maxsel', NULL, 'Back Bar', 'Refrigeration, 3 Door, Beverage', '/products/back_bar_product.png', '', 1, '2026-10-16 12:38:15', '2026-10-16 14:31:41');
REPLACE INTO `products` (`id`, `model_no`, `name`, `brand`, `category_id`, `category_name`, `tags`, `image_url`, `brochure_url`, `is_featured`, `created_at`, `updated_at`) VALUES (6, 'F450GL23', 'F450GL23', 'Western', NULL, 'Deep Freezer', 'Freezers, Glass Top Deep Freezers', '/products/freezer/main_view.png', '', 1, '2026-10-16 16:24:31', '2026-10-16 16:24:31');

SET FOREIGN_KEY_CHECKS = 1;
-- Export completed successfully.