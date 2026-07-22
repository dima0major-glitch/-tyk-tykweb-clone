// Логика управления выезжающей шторкой комментариев
const btnCommentsOpen = document.getElementById('btn-comments-open');
const btnCommentsClose = document.getElementById('btn-comments-close');
const commentsSheet = document.getElementById('comments-sheet');
const btnCommentSend = document.getElementById('btn-comment-send');
const inputCommentText = document.getElementById('input-comment-text');
const commentsListBox = document.getElementById('comments-list-box');
const commentsEmptyMsg = document.getElementById('comments-empty-msg');

// Счетчики на экране
const rightBarCommentCount = btnCommentsOpen.querySelector('.count');
const titleCommentCount = document.getElementById('comments-count-title');

let globalCommentCounter = 0;

// 1. Открытие шторки при клике на иконку комментария справа
btnCommentsOpen.addEventListener('click', () => {
    commentsSheet.classList.remove('hidden');
});

// 2. Закрытие шторки при клике на крестик
btnCommentsClose.addEventListener('click', () => {
    commentsSheet.classList.add('hidden');
});

// Также закрываем шторку, если пользователь кликнул на полупрозрачную темную область выше неё
commentsSheet.addEventListener('click', (e) => {
    if (e.target === commentsSheet) {
        commentsSheet.classList.add('hidden');
    }
});

// 3. Отправка нового комментария
function sendNewComment() {
    const text = inputCommentText.value.trim();
    if (text === "") return; // Если ничего не ввели — игнорируем

    // Удаляем надпись "Будьте первым", если она есть на экране
    if (document.getElementById('comments-empty-msg')) {
        document.getElementById('comments-empty-msg').remove();
    }

    // Получаем текущее имя и аватарку из твоего профиля (чтобы коммент шел от твоего имени)
    const currentUsername = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dima0major";
    const currentAvatar = document.querySelector('.profile-avatar') ? document.querySelector('.profile-avatar').innerText : "😎";

    // Создаем HTML-структуру нового комментария
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item-block';
    
    commentItem.innerHTML = `
        <div class="comment-avatar">${currentAvatar}</div>
        <div class="comment-text-wrap">
            <span class="comment-user">${currentUsername}</span>
            <span class="comment-text-content">${text}</span>
        </div>
    `;

    // Добавляем созданный комментарий в самый верх списка сообщений
    commentsListBox.insertBefore(commentItem, commentsListBox.firstChild);

    // Очищаем поле ввода
    inputCommentText.value = "";

    // Обновляем счетчики комментариев на экране
    globalCommentCounter++;
    titleCommentCount.innerText = globalCommentCounter;
    rightBarCommentCount.innerText = globalCommentCounter;
}

// Привязываем функцию к кнопке-стрелочке отправки
btnCommentSend.addEventListener('click', sendNewComment);

// Делаем так, чтобы комментарий отправлялся и по нажатию кнопки «Ввод» (Enter/Go) на клавиатуре iPhone
inputCommentText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendNewComment();
    }
});
