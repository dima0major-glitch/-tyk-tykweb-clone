// Стабильная логика комментариев через LocalStorage (память iPhone)

const btnCommentsOpen = document.getElementById('btn-comments-open');
const btnCommentsClose = document.getElementById('btn-comments-close');
const commentsSheet = document.getElementById('comments-sheet');
const btnCommentSend = document.getElementById('btn-comment-send');
const inputCommentText = document.getElementById('input-comment-text');
const commentsListBox = document.getElementById('comments-list-box');

const rightBarCommentCount = document.getElementById('right-bar-comment-count');
const titleCommentCount = document.getElementById('comments-count-title');

// 1. Открытие и закрытие шторки
if (btnCommentsOpen) {
    btnCommentsOpen.addEventListener('click', () => commentsSheet.classList.remove('hidden'));
}
if (btnCommentsClose) {
    btnCommentsClose.addEventListener('click', () => commentsSheet.classList.add('hidden'));
}
if (commentsSheet) {
    commentsSheet.addEventListener('click', (e) => {
        if (e.target === commentsSheet) commentsSheet.classList.add('hidden');
    });
}

// Вспомогательная функция для красивого вывода времени
function formatCommentTime(timestamp) {
    if (!timestamp) return "только что";
    const diff = new Date().getTime() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "только что";
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    return new Date(timestamp).toLocaleDateString();
}

// 2. ОТПРАВКА И СОХРАНЕНИЕ КОММЕНТАРИЯ
function sendNewComment() {
    const text = inputCommentText.value.trim();
    if (text === "") return;

    // Достаем ник и аватарку прямо с экрана
    const currentUsername = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dima0major";
    const currentAvatar = document.querySelector('.profile-avatar') ? document.querySelector('.profile-avatar').innerText : "😎";

    const newComment = {
        username: currentUsername,
        avatar: currentAvatar,
        text: text,
        createdAt: new Date().getTime()
    };

    // Читаем старые комменты из памяти телефона
    let savedComments = JSON.parse(localStorage.getItem('tyk_tyk_comments')) || [];
    
    // Добавляем новый в начало массива
    savedComments.unshift(newComment);

    // Перезаписываем память iPhone
    localStorage.setItem('tyk_tyk_comments', JSON.stringify(savedComments));

    inputCommentText.value = ""; // Очищаем поле ввода

    // Обновляем список на экране
    renderComments();
}

if (btnCommentSend) {
    btnCommentSend.addEventListener('click', sendNewComment);
}
if (inputCommentText) {
    inputCommentText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendNewComment();
    });
}

// 3. ОТРИСОВКА ИЗ ПАМЯТИ
function renderComments() {
    if (!commentsListBox) return;

    const savedComments = JSON.parse(localStorage.getItem('tyk_tyk_comments')) || [];
    commentsListBox.innerHTML = "";
    
    savedComments.forEach((data) => {
        const timeString = formatCommentTime(data.createdAt);
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item-block';
        commentItem.innerHTML = `
            <div class="comment-avatar">${data.avatar || '😎'}</div>
            <div class="comment-text-wrap">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="comment-user" style="margin-bottom: 0;">${data.username || '@user'}</span>
                    <span style="font-size: 11px; color: #8a8a8f; font-family: sans-serif;">• ${timeString}</span>
                </div>
                <span class="comment-text-content">${data.text}</span>
            </div>
        `;
        commentsListBox.appendChild(commentItem);
    });

    if (savedComments.length === 0) {
        commentsListBox.innerHTML = `
            <div class="no-comments-msg" id="comments-empty-msg">
                Будьте первым, кто оставит комментарий! 💬
            </div>
        `;
    }

    if (titleCommentCount) titleCommentCount.innerText = savedComments.length;
    if (rightBarCommentCount) rightBarCommentCount.innerText = savedComments.length;
}

// Запускаем отрисовку сразу при старте сайта
renderComments();
