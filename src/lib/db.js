import mysql from "mysql2/promise";

let pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Akshay@2002",
      database: process.env.DB_NAME || "maxsel_db",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const db = getDbPool();
  const [results] = await db.execute(sql, params);
  return results;
}

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  const db = getDbPool();

  // Create admins table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) DEFAULT 'Admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create categories table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      slug VARCHAR(255) NOT NULL UNIQUE,
      capacity_note VARCHAR(255) DEFAULT '',
      is_new BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      model_no VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(100) DEFAULT 'Maxsel',
      category_id INT DEFAULT NULL,
      category_name VARCHAR(255) DEFAULT '',
      tags TEXT,
      image_url TEXT,
      brochure_url TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create product_specifications table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_specifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      spec_key VARCHAR(150) NOT NULL,
      spec_value VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      INDEX idx_product_id (product_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL || "admin@maxsel.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const [existingAdmin] = await db.execute("SELECT id FROM admins WHERE email = ?", [adminEmail]);
  if (existingAdmin.length === 0) {
    await db.execute(
      "INSERT INTO admins (email, password, name) VALUES (?, ?, ?)",
      [adminEmail, adminPassword, "Maxsel Superadmin"]
    );
  }

  // Seed default categories from the menu
  const defaultCategories = [
    { name: "Visi Cooler", slug: "visi-cooler", capacity: "Capacity: 30 Liters – 1500 Liters", is_new: false },
    { name: "Stainless Steel Upright Products", slug: "stainless-steel-upright-products", capacity: "Capacity: 600 Liters to 1800 Liters", is_new: false },
    { name: "Medical Refrigeration", slug: "medical-refrigeration", capacity: "Capacity: 140 Liters to 500 Liters", is_new: true },
    { name: "Deep Freezer", slug: "deep-freezer", capacity: "Capacity: 70 Liters to 720 Liters", is_new: false },
    { name: "Stainless Steel Under Counters", slug: "stainless-steel-under-counters", capacity: "Length: 700 mm to 1800 mm", is_new: false },
    { name: "Storage Water Cooler", slug: "storage-water-cooler", capacity: "Capacity: 80 to 120 Liters", is_new: true },
    { name: "Vertical Freezer", slug: "vertical-freezer", capacity: "Capacity: 300 Liters to 950 Liters", is_new: false },
    { name: "Ice Machines", slug: "ice-machines", capacity: "Capacity: 27 Kgs to 900 kgs", is_new: false },
    { name: "Ice Dispenser", slug: "ice-dispenser", capacity: "Capacity: 110/230 cups/hour", is_new: false },
    { name: "Pastry Cabinet", slug: "pastry-cabinet", capacity: "Length: 2 – 5 ft.", is_new: false },
    { name: "Back Bar", slug: "back-bar", capacity: "Capacity: 226 Liters to 349 Liters", is_new: false },
    { name: "Supermarket Range", slug: "supermarket-range", capacity: "Capacity: 935 to 1435 Liters", is_new: false },
    { name: "Golden Confectionery Cabinet", slug: "golden-confectionery-cabinet", capacity: "Length: 3 – 5 ft", is_new: true },
    { name: "Dishwasher", slug: "dishwasher", capacity: "Capacity: 33 to 69 Basket per hour", is_new: true },
    { name: "Vending Machine", slug: "vending-machine", capacity: "Capacity: 1110 to 1150 Liters", is_new: true },
    { name: "Preparation Table", slug: "preparation-table", capacity: "Capacity: 272 Liters to 1000 Liters", is_new: false },
    { name: "Glass Washer", slug: "glass-washer", capacity: "Capacity: 18 to 33 Basket per hour", is_new: true },
    { name: "Counter Top", slug: "counter-top", capacity: "Compact Display & Cooler Units", is_new: false },
  ];

  for (const cat of defaultCategories) {
    const [exist] = await db.execute("SELECT id FROM categories WHERE slug = ?", [cat.slug]);
    if (exist.length === 0) {
      await db.execute(
        "INSERT INTO categories (name, slug, capacity_note, is_new) VALUES (?, ?, ?, ?)",
        [cat.name, cat.slug, cat.capacity, cat.is_new]
      );
    }
  }

  // Create brands table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS brands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default brands
  const defaultBrands = ["Western", "Hoshizaki", "Butler", "Maxsel", "Rational", "Unox"];
  for (const b of defaultBrands) {
    const [exist] = await db.execute("SELECT id FROM brands WHERE name = ?", [b]);
    if (exist.length === 0) {
      await db.execute("INSERT INTO brands (name) VALUES (?)", [b]);
    }
  }

  // Create enquiries table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      product_category VARCHAR(255) DEFAULT '',
      requirements TEXT,
      total_items INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create enquiry_items table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS enquiry_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      enquiry_id INT NOT NULL,
      product_id INT DEFAULT NULL,
      product_name VARCHAR(255) NOT NULL,
      model_no VARCHAR(100) DEFAULT '',
      category_name VARCHAR(255) DEFAULT '',
      price DECIMAL(10, 2) DEFAULT 0.00,
      quantity INT DEFAULT 1,
      INDEX idx_enquiry_id (enquiry_id),
      FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  isInitialized = true;
}
