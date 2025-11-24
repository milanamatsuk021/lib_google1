<?php
$host = getenv('DB_HOST') ?: 'localhost';
$db   = getenv('DB_NAME') ?: 'library';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$charset = 'utf8mb4';

$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    error_log('DB connection error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Не удалось подключиться к базе. Проверьте хост, логин, пароль, имя БД и расширение pdo_mysql. Значения берутся из DB_HOST, DB_USER, DB_PASS, DB_NAME.'
    ]);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
