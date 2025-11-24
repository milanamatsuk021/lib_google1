<?php
function loadDbConfig(): array
{
    $config = [];

    $configPath = __DIR__ . '/config.php';
    if (file_exists($configPath)) {
        $loaded = include $configPath;
        if (is_array($loaded)) {
            $config = array_merge($config, $loaded);
        }
    }

    $envPath = __DIR__ . '/.env';
    if (file_exists($envPath)) {
        $parsed = parse_ini_string(file_get_contents($envPath));
        if (is_array($parsed)) {
            $config = array_merge($config, $parsed);
        }
    }

    $host = $config['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
    $db = $config['DB_NAME'] ?? getenv('DB_NAME') ?: 'library';
    $user = $config['DB_USER'] ?? getenv('DB_USER') ?: 'root';
    $pass = $config['DB_PASS'] ?? getenv('DB_PASS') ?: '';
    $charset = $config['DB_CHARSET'] ?? getenv('DB_CHARSET') ?: 'utf8mb4';
    $port = $config['DB_PORT'] ?? getenv('DB_PORT');

    return [
        'host' => $host,
        'db' => $db,
        'user' => $user,
        'pass' => $pass,
        'charset' => $charset,
        'port' => $port,
    ];
}
?>
