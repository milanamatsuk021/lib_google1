<?php
// Глобальные обработчики, чтобы всегда отдавать JSON даже при фатальных ошибках БД/расширений
$responseSent = false;

set_error_handler(function ($severity, $message, $file, $line) use (&$responseSent) {
    if (!(error_reporting() & $severity)) {
        return;
    }

    $exception = new ErrorException($message, 0, $severity, $file, $line);
    http_response_code(500);
    header('Content-Type: application/json');
    error_log('Book actions warning/error: ' . $exception->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера. Проверьте логи и подключение к БД']);
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
    error_log('Book actions fatal error: ' . ($error['message'] ?? 'unknown'));
    echo json_encode(['success' => false, 'message' => 'Критическая ошибка сервера, детали в логах']);
});

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
    exit;
}

$action = $_POST['action'] ?? '';
$userId = (int) $_SESSION['user_id'];

try {
    if ($action === 'add') {
        $title = trim($_POST['title'] ?? '');
        $author = trim($_POST['author'] ?? '');
        $status = trim($_POST['status'] ?? 'Хочу прочесть');
        $review = trim($_POST['review'] ?? '');

        if ($title === '' || $author === '') {
            echo json_encode(['success' => false, 'message' => 'Название и автор обязательны']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO books (user_id, title, author, status, review) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$userId, $title, $author, $status, $review]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        exit;
    }

    if ($action === 'delete') {
        $id = (int) ($_POST['id'] ?? 0);
        $stmt = $pdo->prepare('DELETE FROM books WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);

        echo json_encode(['success' => $stmt->rowCount() > 0, 'message' => $stmt->rowCount() ? 'Книга удалена' : 'Книга не найдена']);
        exit;
    }

    if ($action === 'update') {
        $id = (int) ($_POST['id'] ?? 0);
        $field = $_POST['field'] ?? '';
        $value = trim($_POST['value'] ?? '');

        $allowedFields = ['title', 'author', 'status', 'review'];
        if (!in_array($field, $allowedFields, true)) {
            echo json_encode(['success' => false, 'message' => 'Недопустимое поле']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE books SET {$field} = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$value, $id, $userId]);

        echo json_encode(['success' => $stmt->rowCount() > 0, 'message' => $stmt->rowCount() ? 'Изменения сохранены' : 'Книга не найдена']);
        exit;
    }
} catch (Throwable $e) {
    http_response_code(500);
    error_log('Book action error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера при работе с книгами. Проверьте подключение к БД и таблицу books']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Неподдерживаемое действие']);
?>
