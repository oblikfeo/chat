<?php

/**
 * Одноразовый скрипт: создать двух тестовых пользователей.
 * Запуск: php bootstrap/create_test_users.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$users = [
    ['email' => 'friend1@test.local', 'name' => 'Friend One', 'password' => 'password'],
    ['email' => 'friend2@test.local', 'name' => 'Friend Two', 'password' => 'password'],
];

foreach ($users as $data) {
    User::updateOrCreate(
        ['email' => $data['email']],
        [
            'name' => $data['name'],
            'password' => $data['password'],
            'email_verified_at' => now(),
        ]
    );
}

echo "OK: friend1@test.local / password\n";
echo "OK: friend2@test.local / password\n";
