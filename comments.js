// Стабильная логика комментариев через LocalStorage (память iPhone) с привязкой к бесконечной ленте
import { uploadedVideos, activeVideoIndex } from './app.js';

const btnCommentsClose = document.getElementById('btn-comments-close');
const commentsSheet = document.getElementById('comments-sheet');
const btnCommentSend = document.getElementById('btn-comment-send');
const inputCommentText = document.getElementById('input-comment-text');
const commentsListBox = document.getElementById('comments-list-box');
const titleCommentCount = document.getElementById('comments-count-title');

let currentCommentVideoIndex = null;

document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('video-feed');
    
    if (feedContainer) {
        // Делегируем клик открытия комментов для динамических карточек на ленте
        feedContainer.addEventListener('click', (e) => {
            const commentBtn = e.target.closest('.comment-btn');
            if (commentBtn) {
                currentCommentVideoIndex = parseInt(commentBtn.getAttribute('data-index'));
                openComments();
            }
        });
    }

    if (btnCommentsClose) {
        btnCommentsClose.addEventListener('click', closeComments);
    }

    if (commentsSheet) {
        commentsSheet.addEventListener('click', (e) => {
            if (e.target === commentsSheet) closeComments();
        });
    }

    if (btnCommentSend) {
        btnCommentSend.addEventListener('click', sendNewComment);
    }

    if (inputCommentText) {
        inputCommentText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendNewComment();
        });
    }
});

function openComments() {
    if (commentsSheet) commentsSheet.classList.remove('hidden');
    renderComments();
}

function closeComments() {
    if (commentsSheet) commentsSheet.classList.add('hidden');
    currentCommentVideoIndex = null;
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

// 2. ОТПРАВКА И СОХРАНЕНИЕ КОММЕНТАРИЯ К КОНКРЕТНОМУ РОЛИКУ
function sendNewComment() {
    const text = inputCommentText.value.trim();
    // Проверяем, есть ли текст и выбрано ли активное видео
    const targetIndex = currentCommentVideoIndex !== null ? currentCommentVideoIndex : activeVideoIndex;
    if (text === "" || !uploadedVideos[targetIndex]) return;

    // Достаем ник и аватарку прямо с экрана
    const currentUsername = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dima0major";
    const currentAvatar = document.querySelector('.profile-avatar') ? document.querySelector('.profile-avatar').innerText : "😎";

    const newComment = {
        username: currentUsername,
        avatar: currentAvatar,
        text: text,
        createdAt: new Date().getTime()
    };

    const videoData = uploadedVideos[targetIndex];
    if (!videoData.comments) videoData.comments = [];
    
    // Добавляем новый коммент в начало массива этого видео
    videoData.comments.unshift(newComment);

    // Сохраняем обновленный массив всей ленты видео в память iPhone
    localStorage.setItem('tyk_tyk_videos_state', JSON.stringify(uploadedVideos));

    inputCommentText.value = ""; // Очищаем поле ввода

    // Обновляем счетчик на кнопке внутри самой карточки видео на ленте
    const currentCard = document.querySelector(`#video-feed .video-card[data-index="${targetIndex}"]`);
    if (currentCard) {
        const counter = currentCard.querySelector('.comment-count');
        if (counter) counter.innerText = videoData.comments.length;
    }

    // Обновляем список на экране шторки
    renderComments();
}

// 3. ОТРИСОВКА ИЗ ОБЪЕКТА АКТИВНОГО ВИДЕО
function renderComments() {
    if (!commentsListBox) return;

    const targetIndex = currentCommentVideoIndex !== null ? currentCommentVideoIndex : activeVideoIndex;
    const videoData = uploadedVideos[targetIndex];

    if (!videoData) {
        commentsListBox.innerHTML = `
            <div class="no-comments-msg" id="comments-empty-msg">
                Будьте первым, кто оставит комментарий! 💬
            </div>
        `;
        if (titleCommentCount) titleCommentCount.innerText = "0";
        return;
    }

    const currentComments = videoData.comments || [];
    commentsListBox.innerHTML = "";
    
    currentComments.forEach((data) => {
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

    if (currentComments.length === 0) {
        commentsListBox.innerHTML = `
            <div class="no-comments-msg" id="comments-empty-msg">
                Будьте первым, кто оставит комментарий! 💬
            </div>
        `;
    }

    if (titleCommentCount) titleCommentCount.innerText = currentComments.length;
}
