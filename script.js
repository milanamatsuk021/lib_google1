// Переключение табов (Вход/Регистрация)
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-container').forEach(form => form.classList.remove('active'));
    
    // Поиск кнопки по тексту или индексу (упрощено)
    const btns = document.querySelectorAll('.tab-btn');
    if (tab === 'login') {
        btns[0].classList.add('active');
        document.getElementById('login-form-container').classList.add('active');
    } else {
        btns[1].classList.add('active');
        document.getElementById('register-form-container').classList.add('active');
    }
    document.getElementById('message-box').textContent = '';
}

// Обработка Входа и Регистрации
async function handleAuth(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('action', type);

    try {
        const response = await fetch('auth.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            window.location.href = 'dashboard.php';
        } else {
            document.getElementById('message-box').textContent = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message-box').textContent = 'Произошла ошибка сервера';
    }
}

// Добавление книги
async function handleAddBook(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('action', 'add');

    try {
        const response = await fetch('book_actions.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            window.location.reload(); // Перезагрузка для отображения новой книги
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка при добавлении книги');
    }
}

// Удаление книги
async function handleDelete(id) {
    if (!confirm('Вы уверены, что хотите удалить эту книгу?')) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    try {
        const response = await fetch('book_actions.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            document.getElementById(`book-${id}`).remove();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Обновление книги (Inline редактирование)
async function handleUpdate(id, field, value) {
    // Если это статус, value передается напрямую из select
    // Если это contenteditable, value - это textContent
    
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', id);
    formData.append('field', field);
    formData.append('value', value);

    try {
        const response = await fetch('book_actions.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (!result.success) {
            alert(result.message);
            // В идеале здесь нужно вернуть старое значение при ошибке
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
