SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE surplus_posts;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

INSERT IGNORE INTO categories (id, name) VALUES (1, 'Kopi'), (2, 'Roti'), (3, 'Kue'), (4, 'Makanan Berat');

INSERT INTO products (id, cafe_id, category_id, name, description, image_url, price, current_stock, is_active, version) VALUES 
(1, 1, 2, 'Golden Croissant', 'Croissant mentega yang renyah dan lezat.', '/uploads/images/croissant.png', 25000, 100, 1, 0),
(2, 1, 1, 'Kopi Susu Aren', 'Es Kopi Susu dengan gula aren asli pilihan.', '/uploads/images/kopi_susu.png', 18000, 50, 1, 0),
(3, 1, 4, 'Nasi Goreng Spesial', 'Nasi Goreng ayam dengan telur mata sapi.', '/uploads/images/nasi_goreng.png', 35000, 30, 1, 0);

INSERT INTO surplus_posts (id, product_id, cafe_id, quantity, expiry_date, price, status, created_at, version) VALUES 
(1, 1, 1, 15, DATE_ADD(NOW(), INTERVAL 2 DAY), 12500, 'TERSEDIA', NOW(), 0),
(2, 2, 1, 10, DATE_ADD(NOW(), INTERVAL 1 DAY), 9000, 'TERSEDIA', NOW(), 0),
(3, 3, 1, 5, DATE_ADD(NOW(), INTERVAL 6 HOUR), 17500, 'TERSEDIA', NOW(), 0);
