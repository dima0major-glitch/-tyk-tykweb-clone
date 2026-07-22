// Логика комментариев с интеграцией Живой Облачной Базы данных (Firebase Firestore)

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

// 2. ОТПРАВКА КОММЕНТАРИЯ В ОБЛАКО FIREBASE
async function sendNewComment() {
    const text = inputCommentText.value.trim();
    if (text === "") return;

    // Берем текущий ник и аватарку прямо с экрана профиля
    const currentUsername = document.querySelector('.profile-tag').innerText;
    const currentAvatar = document.querySelector('.profile-avatar').innerText;

    try {
        if (window.db && window.fbCollection && window.fbAddDoc) {
            // Отправляем объект в коллекцию "comments" в облако Firebase
            await window.fbAddDoc(window.fbCollection(window.db, "comments"), {
                username: currentUsername,
                avatar: currentAvatar,
                text: text,
                createdAt: new Date().getTime() // Время для правильной сортировки
            });
            inputCommentText.value = ""; // Очищаем поле после отправки
        } else {
            console.error("Firebase еще не инициализирован. Проверь подключение скриптов.");
        }
    } catch (error) {
        console.error("Ошибка при отправке в Firebase:", error);
    }
}

btnCommentSend.addEventListener('click', sendNewComment);
inputCommentText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendNewComment();
});

// 3. ЖИВОЕ СЛУШАНИЕ И ОБНОВЛЕНИЕ КОММЕНТАРИЕВ С СЕРВЕРА GOOGLE
function listenToComments() {
    if (!window.db || !window.fbCollection || !window.fbOnSnapshot || !window.fbQuery || !window.fbOrderBy) {
        // Если Firebase грузится чуть дольше, перезапустим проверку через 200 миллисекунд
        setTimeout(listenToComments, 200);
        return;
    }

    // Создаем запрос к коллекции "comments" со сортировкой от новых к старым
    const q = window.fbQuery(window.fbCollection(window.db, "comments"), window.fbOrderBy("createdAt", "desc"));

    // Запускаем живого слушателя облака
    window.fbOnSnapshot(q, (snapshot) => {
        commentsListBox.innerHTML = "";
        let counter = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            counter++;

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

        // Если комментариев в базе нет — показываем заглушку
        if (counter === 0) {
            commentsListBox.innerHTML = `
                <div class="no-comments-msg" id="comments-empty-msg">
                    Будьте первым, кто оставит комментарий! 💬
                </div>
            `;
        }

        // Обновляем циферки счетчиков на кнопке и в шторке
        if (titleCommentCount) titleCommentCount.innerText = counter;
        if (rightBarCommentCount) rightBarCommentCount.innerText = counter;
    });
}

// Запускаем процесс живого отслеживания базы
listenToComments();
