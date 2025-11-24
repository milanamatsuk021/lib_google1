<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личная библиотека — Вход</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="auth-body">
    <div class="auth-container">
        <div class="auth-header">
            <h1>Личная библиотека</h1>
            <p>Войдите или зарегистрируйтесь, чтобы продолжить</p>
        </div>

        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('login')">Вход</button>
            <button class="tab-btn" onclick="switchTab('register')">Регистрация</button>
        </div>

        <div id="message-box" style="min-height: 20px; color: #ef4444; margin-bottom: 10px;"></div>

        <div id="login-form-container" class="form-container active">
            <form onsubmit="handleAuth(event, 'login')">
                <div class="input-group">
                    <label for="login-username">Логин</label>
                    <input id="login-username" name="username" type="text" required />
                </div>
                <div class="input-group">
                    <label for="login-password">Пароль</label>
                    <input id="login-password" name="password" type="password" required />
                </div>
                <button type="submit" class="btn-primary">Войти</button>
            </form>
        </div>

        <div id="register-form-container" class="form-container">
            <form onsubmit="handleAuth(event, 'register')">
                <div class="input-group">
                    <label for="register-username">Логин</label>
                    <input id="register-username" name="username" type="text" required />
                </div>
                <div class="input-group">
                    <label for="register-password">Пароль</label>
                    <input id="register-password" name="password" type="password" required />
                </div>
                <button type="submit" class="btn-primary">Создать аккаунт</button>
            </form>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
