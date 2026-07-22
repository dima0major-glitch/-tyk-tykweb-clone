// Логика комментариев с интеграцией LocalStorage (память твоего iPhone)

const btnCommentsOpen = document.getElementById('btn-comments-open');
const btnCommentsClose = document.getElementById('btn-comments-close');
const commentsSheet = document.getElementById('comments-sheet');
const btnCommentSend = document.getElementById('btn-comment-send');
const inputCommentText = document.getElementById('input-comment-text');
const commentsListBox = document.getElementById('comments-list-box');

const rightBarCommentCount = document.getElementById('right-bar-comment-count');
const titleCommentCount = document.getElementById('comments-count-title');

// 1. Открытие и закрытие шторки
btnCommentsOpen.addEventListener('click', () => commentsSheet.classList.remove('hidden'));
btnCommentsClose.addEventListener('click', () => commentsSheet.classList.add('hidden'));
commentsSheet.addEventListener('click', (e) => {
    if (e.target === commentsSheet) commentsSheet.classList.add('hidden');
});

// 2. ОТПРАВКА И СОХРАНЕНИЕ КОММЕНТАРИЯ В ПАМЯТЬ ТЕЛЕФОНА
function sendNewComment() {
    const text = inputCommentText.value.trim();
    if (text === "") return;

    const currentUsername = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dima0major";
    const currentAvatar = document.querySelector('.profile-avatar') ? document.querySelector('.profile-avatar').innerText : "😎";

    // Создаем объект нового комментария
    const newComment = {
        username: currentUsername,
        avatar: currentAvatar,
        text: text
    };

    // Достаем уже сохраненные комменты из памяти телефона (или создаем пустой массив, если их нет)
    let savedComments = JSON.parse(localStorage.getItem('tyk_tyk_comments')) || [];
    
    // Добавляем наш новый коммент в самое начало списка
    savedComments.unshift(newComment);

    // Записываем обновленный список обратно в память Айфона
    localStorage.setItem('tyk_tyk_comments', JSON.stringify(savedComments));

    inputCommentText.value = ""; // Очищаем поле ввода

    // Перерисовываем список на экране
    renderComments();
}

btnCommentSend.addEventListener('click', sendNewComment);
inputCommentText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendNewComment();
});

// 3. ФУНКЦИЯ ОТРИСОВКИ КОММЕНТАРИЕВ НА ЭКРАНЕ
function renderComments() {
    // Снова достаем список из памяти
    const savedComments = JSON.parse(localStorage.getItem('tyk_tyk_comments')) || [];
    
    // Очищаем шторку перед выводом
    commentsListBox.innerHTML = "";
    
    // Отрисовываем каждый коммент
    savedComments.forEach((data) => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item-block';
        commentItem.innerHTML = `
            <div class="comment-avatar">${data.avatar || '😎'}</div>
            <div class="comment-text-wrap">
                <span class="comment-user">${data.username || '@user'}</span>
                <span class="comment-text-content">${data.text}</span>
            </div>
        `;
        commentsListBox.appendChild(commentItem);
    });

    // Если комментариев вообще нет — возвращаем красивую заглушку
    if (savedComments.length === 0) {
        commentsListBox.innerHTML = `
            <div class="no-comments-msg" id="comments-empty-msg">
                Будьте первым, кто оставит комментарий! 💬
            </div>
        `;
    }

    // Обновляем циферки счетчиков на кнопке и в шапке шторки
    if (titleCommentCount) titleCommentCount.innerText = savedComments.length;
    if (rightBarCommentCount) rightBarCommentCount.innerText = savedComments.length;
}

// Запускаем отрисовку сохраненных комментов сразу при загрузке сайта
renderComments();
