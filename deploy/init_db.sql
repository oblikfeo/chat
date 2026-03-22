-- Replace __DB_PASS__ before upload or use sed on server
CREATE DATABASE IF NOT EXISTS messenger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'messenger'@'localhost' IDENTIFIED BY '__DB_PASS__';
GRANT ALL PRIVILEGES ON messenger.* TO 'messenger'@'localhost';
FLUSH PRIVILEGES;
