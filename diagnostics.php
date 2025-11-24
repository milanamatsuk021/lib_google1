<?php
// Вспомогательный файл для проверки соединения с БД на хостинге (например, Beget).
// Не храните его публично после отладки: удалите или ограничьте доступ.

header('Content-Type: text/plain; charset=utf-8');
require_once __DIR__ . '/db_config.php';

$config = loadDbConfig();
$host = $config['host'];
$db = $config['db'];
$user = $config['user'];
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

echo "Проверка подключения к БД\n";
echo "Host: {$host}\n";
echo "DB: {$db}\n";
echo "User: {$user}\n";
echo "Port: " . ($port ?: 'по умолчанию') . "\n";
echo "Charset: {$charset}\n\n";

try {
    $pdo = new PDO($dsn, $user, $config['pass'], $options);
    echo "Соединение установлено успешно.\n";

    $tables = ['users', 'books'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '" . $table . "'");
        if ($stmt && $stmt->fetch()) {
            echo "Таблица {$table} найдена.\n";
        } else {
            echo "Таблица {$table} НЕ найдена. Импортируйте db.sql.\n";
        }
    }
} catch (Throwable $e) {
    echo "Ошибка подключения: " . $e->getMessage() . "\n";
    echo "Проверьте логин/пароль, имя БД, host/port и наличие расширения pdo_mysql.\n";
    exit(1);
}
?>
