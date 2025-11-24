<?php
require_once __DIR__ . '/db_config.php';

$config = loadDbConfig();

$host = $config['host'];
$db   = $config['db'];
$user = $config['user'];
$pass = $config['pass'];
$charset = $config['charset'];
$port = $config['port'];

$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
if (!empty($port)) {
    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
}

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
    error_log(sprintf('DB connection error (%s:%s/%s): %s', $host, $port ?: 'default', $db, $e->getMessage()));
    echo json_encode([
        'success' => false,
        'message' => 'Не удалось подключиться к базе. Проверьте host/login/password/name в config.php или .env и доступность расширения pdo_mysql.'
    ]);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
