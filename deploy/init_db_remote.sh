#!/bin/bash
set -euo pipefail
PASS=$(openssl rand -base64 18 | tr -d '/+=' | head -c 22)
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS messenger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'messenger'@'localhost' IDENTIFIED BY '$PASS';
GRANT ALL PRIVILEGES ON messenger.* TO 'messenger'@'localhost';
FLUSH PRIVILEGES;
EOF
echo "$PASS" > /home/chat/.db_pass_messenger
chmod 600 /home/chat/.db_pass_messenger
echo "DB password written to /home/chat/.db_pass_messenger"
echo "PASSWORD=$PASS"
