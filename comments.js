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

    const currentUsername = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dima0major";
    const currentAvatar = document.querySelector('.profile-avatar') ? document.querySelector('.profile-avatar').innerText : "😎";

    try {
        // Проверяем, загрузилась ли база данных во всемирное окно window
        if (window.db && window.fbCollection && window.fbAddDoc) {
            // Отправляем объект в коллекцию "comments" в облако Firebase
            await window.fbAddDoc(window.fbCollection(window.db, "comments"), {
                username: currentUsername,
                avatar: currentAvatar,
                text: text,
                createdAt: new Date().getTime() // Время отправки, чтобы сортировать по порядку
            });
            inputCommentText.value = ""; // Очищаем поле после успешной отправки
        } else {
            console.error("Firebase еще не инициализирован");
        }
    } catch (error) {
        console.error("Ошибка при отправке в Firebase:", error);
    }
}

btnCommentSend.addEventListener('click', sendNewComment);
inputCommentText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendNewComment();
});

// 3. ЖИВОЕ СЛУШАНИЕ И ОБНОВЛЕНИЕ КОММЕНТАРИЕВ С СЕРВЕРА
// Как только в облаке появится коммент — эта функция сама отрисует его на экране iPhone
function listenToComments() {
    if (!window.db || !window.fbCollection || !window.fbOnSnapshot || !window.fbQuery || !window.fbOrderBy) {
        // Если Firebase грузится чуть медленнее, перезапустим проверку через 200 миллисекунд
        setTimeout(listenToComments, 200);
        return;
    }

    // Создаем запрос к коллекции "comments" со сортировкой по времени (сначала новые)
    const q = window.fbQuery(window.fbCollection(window.db, "comments"), window.fbOrderBy("createdAt", "desc"));

    // Запускаем живого слушателя
    window.fbOnSnapshot(q, (snapshot) => {
        // Очищаем контейнер перед обновлением
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

        // Если комментариев вообще нет — возвращаем заглушку
        if (counter === 0) {
            commentsListBox.innerHTML = `
                <div class="no-comments-msg" id="comments-empty-msg">
                    Будьте первым, кто оставит комментарий! 💬
                </div>
            `;
        }

        // Обновляем циферки счетчиков везде
        if (titleCommentCount) titleCommentCount.innerText = counter;
        if (rightBarCommentCount) rightBarCommentCount.innerText = counter;
    });
}

// Запускаем процесс живого отслеживания базы
listenToComments();
