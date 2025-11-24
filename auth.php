<?php
// Глобальный обработчик для предупреждений/фатальных ошибок, чтобы фронт всегда получил JSON,
// даже если не загрузилось подключение к БД или расширение PDO
$responseSent = false;

set_error_handler(function ($severity, $message, $file, $line) use (&$responseSent) {
    if (!(error_reporting() & $severity)) {
        return;
    }

    $exception = new ErrorException($message, 0, $severity, $file, $line);
    http_response_code(500);
    error_log('Auth warning/error: ' . $exception->getMessage());
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера. Проверьте логи для деталей']);
    $responseSent = true;
    exit;
});

register_shutdown_function(function () use (&$responseSent) {
    $error = error_get_last();
    if ($responseSent || $error === null) {
        return;
    }

    http_response_code(500);
    header('Content-Type: application/json');
    error_log('Auth fatal error: ' . ($error['message'] ?? 'unknown'));
    echo json_encode(['success' => false, 'message' => 'Критическая ошибка сервера, детали в логах']);
});

require_once __DIR__ . '/db.php';

$action = $_POST['action'] ?? ($_GET['action'] ?? '');

if ($action === 'logout') {
    session_destroy();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Location: index.php');
        exit;
    }

    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Вы вышли из аккаунта']);
    exit;
}

header('Content-Type: application/json');

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

try {
    if ($action === 'register') {
        if ($username === '' || $password === '') {
            echo json_encode(['success' => false, 'message' => 'Введите логин и пароль']);
            exit;
        }

        $checkStmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
        $checkStmt->execute([$username]);

        if ($checkStmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Пользователь с таким логином уже существует']);
            exit;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $insertStmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
        $insertStmt->execute([$username, $hash]);

        $_SESSION['user_id'] = $pdo->lastInsertId();
        $_SESSION['username'] = $username;

        echo json_encode(['success' => true, 'message' => 'Регистрация прошла успешно']);
        exit;
    }

    if ($action === 'login') {
        if ($username === '' || $password === '') {
            echo json_encode(['success' => false, 'message' => 'Введите логин и пароль']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            echo json_encode(['success' => false, 'message' => 'Неверный логин или пароль']);
            exit;
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;

        echo json_encode(['success' => true, 'message' => 'Успешный вход']);
        exit;
    }
} catch (Throwable $e) {
    http_response_code(500);
    error_log('Auth error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера. Проверьте подключение к БД и наличие таблиц']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Неподдерживаемое действие']);
?>
