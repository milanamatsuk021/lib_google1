<?php
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$userId = (int) $_SESSION['user_id'];
$username = $_SESSION['username'] ?? '';

$stmt = $pdo->prepare('SELECT id, title, author, status, review, created_at FROM books WHERE user_id = ? ORDER BY created_at DESC');
$stmt->execute([$userId]);
$books = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личная библиотека — Панель</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar">
    <div class="container nav-content">
        <div class="brand">Личная библиотека</div>
        <div>
            <span>Привет, <?php echo htmlspecialchars($username); ?></span>
            <a href="auth.php?action=logout" class="btn-logout">Выйти</a>
        </div>
    </div>
</nav>

<div class="container">
    <section class="card">
        <h2 style="margin-top: 0;">Добавить книгу</h2>
        <form class="form-grid" onsubmit="handleAddBook(event)">
            <div class="form-row">
                <div class="input-group">
                    <label for="title">Название</label>
                    <input id="title" name="title" required />
                </div>
                <div class="input-group">
                    <label for="author">Автор</label>
                    <input id="author" name="author" required />
                </div>
            </div>
            <div class="input-group">
                <label for="status">Статус</label>
                <select id="status" name="status">
                    <option value="Хочу прочесть">Хочу прочесть</option>
                    <option value="Читаю">Читаю</option>
                    <option value="Прочитано">Прочитано</option>
                </select>
            </div>
            <div class="input-group">
                <label for="review">Заметки / отзыв</label>
                <textarea id="review" name="review" rows="3" placeholder="Поделитесь впечатлениями"></textarea>
            </div>
            <button type="submit" class="btn-primary">Сохранить</button>
        </form>
    </section>

    <section style="margin-top: 30px;">
        <h2 style="margin: 0 0 15px 0;">Ваши книги</h2>
        <?php if (empty($books)): ?>
            <p>Здесь появятся ваши книги после добавления.</p>
        <?php else: ?>
            <div class="books-grid">
                <?php foreach ($books as $book): ?>
                    <article class="card book-card" id="book-<?php echo $book['id']; ?>">
                        <div class="book-header">
                            <div class="book-title-area">
                                <h3 contenteditable="true" onblur="handleUpdate(<?php echo $book['id']; ?>, 'title', this.textContent)"><?php echo htmlspecialchars($book['title']); ?></h3>
                                <p class="author" contenteditable="true" onblur="handleUpdate(<?php echo $book['id']; ?>, 'author', this.textContent)"><?php echo htmlspecialchars($book['author']); ?></p>
                            </div>
                            <button class="btn-icon delete" onclick="handleDelete(<?php echo $book['id']; ?>)">×</button>
                        </div>

                        <div class="book-status-area">
                            <label for="status-<?php echo $book['id']; ?>">Статус</label>
                            <select id="status-<?php echo $book['id']; ?>" onchange="handleUpdate(<?php echo $book['id']; ?>, 'status', this.value)">
                                <?php
                                $statuses = ['Хочу прочесть', 'Читаю', 'Прочитано'];
                                foreach ($statuses as $status) {
                                    $selected = $status === $book['status'] ? 'selected' : '';
                                    echo "<option value=\"{$status}\" {$selected}>{$status}</option>";
                                }
                                ?>
                            </select>
                        </div>

                        <div class="book-review-area">
                            <label>Заметки</label>
                            <div class="review-content" contenteditable="true" onblur="handleUpdate(<?php echo $book['id']; ?>, 'review', this.textContent)"><?php echo nl2br(htmlspecialchars($book['review'])); ?></div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </section>
</div>

<script src="script.js"></script>
</body>
</html>
