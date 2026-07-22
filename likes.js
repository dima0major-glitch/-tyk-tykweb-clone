// Логика лайков, двойного тапа и динамического добавления в список "Понравилось"
import { uploadedVideos, activeVideoIndex, playVideoAtIndex } from './app.js';

const likedGrid = document.getElementById('liked-grid');
let lastTap = 0;

document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('video-feed');
    
    if (feedContainer) {
        // Перехватываем клики по всей ленте
        feedContainer.addEventListener('click', function(e) {
            const clickArea = e.target.closest('.video-click-area');
            const likeBtn = e.target.closest('.like-btn');
            
            // 1. Обработка клика/двойного тапа по экрану видео
            if (clickArea) {
                const index = parseInt(clickArea.getAttribute('data-index'));
                const card = clickArea.closest('.video-card');
                const videoEl = card.querySelector('video');
                
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 300 && tapLength > 0) {
                    handleDoubleTap(e, index, card);
                    e.preventDefault();
                } else {
                    setTimeout(() => {
                        if (new Date().getTime() - lastTap >= 300) {
                            if (videoEl) {
                                if (videoEl.paused) videoEl.play().catch(() => {});
                                else videoEl.pause();
                            }
                        }
                    }, 300);
                }
                lastTap = currentTime;
            }
            
            // 2. Обработка клика по кнопке сердечка справа
            if (likeBtn) {
                const index = parseInt(likeBtn.getAttribute('data-index'));
                const card = likeBtn.closest('.video-card');
                window.toggleLike(index, card);
            }
        });
    }
});

// Клик по кнопке сердечка справа (сделана глобальной для поддержки onclick, если нужно)
window.toggleLike = function(index, card) {
    // Если параметры не переданы, берем текущее активное видео
    if (index === undefined) index = activeVideoIndex;
    if (!card) card = document.querySelector(`#video-feed .video-card[data-index="${index}"]`);
    
    if (!uploadedVideos[index] || !card) return; 
    
    const videoData = uploadedVideos[index];
    const likeBtnRight = card.querySelector('.like-btn');
    const likeCountSpan = card.querySelector('.like-count');
    
    videoData.isLiked = !videoData.isLiked;
    
    if (videoData.isLiked) {
        videoData.likes += 1;
        if (likeBtnRight) likeBtnRight.classList.add('liked');
        if (likeBtnRight) {
            const icon = likeBtnRight.querySelector('.button-icon');
            if (icon) icon.innerText = '❤️';
        }
        addToLikedGrid(videoData.url, index);
    } else {
        videoData.likes = Math.max(0, videoData.likes - 1);
        if (likeBtnRight) likeBtnRight.classList.remove('liked');
        if (likeBtnRight) {
            const icon = likeBtnRight.querySelector('.button-icon');
            if (icon) icon.innerText = '🤍';
        }
        removeFromLikedGrid(videoData.url);
    }
    
    if (likeCountSpan) likeCountSpan.innerText = videoData.likes;
};

function handleDoubleTap(e, index, card) {
    const videoData = uploadedVideos[index];
    
    // Если еще не лайкнуто, лайкаем
    if (videoData && !videoData.isLiked) {
        window.toggleLike(index, card);
    }

    const clickArea = card.querySelector('.video-click-area');
    const heartBox = card.querySelector('.heart-animation-container');
    
    if (clickArea && heartBox) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        
        // Стили анимации из твоего изначального CSS или для корректного отображения:
        heart.style.position = 'absolute';
        heart.style.fontSize = '80px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10';
        heart.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

        const rect = clickArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
        
        heartBox.appendChild(heart);

        // Форсируем анимацию взлета/исчезновения через JS, если в CSS её нет
        setTimeout(() => {
            heart.style.transform = 'translate(-50%, -150%) scale(1.2)';
            heart.style.opacity = '0';
        }, 50);

        setTimeout(() => { heart.remove(); }, 600);
    }
}

// ДОБАВЛЕНИЕ ВИДЕО ВО ВКЛАДКУ "ПОНРАВИЛОСЬ"
function addToLikedGrid(url, index) {
    if (!likedGrid) return;

    const emptyLikedMsg = document.getElementById('liked-empty-msg');
    if (emptyLikedMsg) emptyLikedMsg.remove();

    // Проверяем, нет ли уже этого видео в сетке лайкнутых
    if (likedGrid.querySelector(`[data-video-url="${url}"]`)) return;

    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute('data-video-url', url);
    
    const previewVideo = document.createElement('video');
    previewVideo.src = url;
    previewVideo.muted = true;
    previewVideo.playsInline = true;
    previewVideo.style.width = '100%';
    previewVideo.style.height = '100%';
    previewVideo.style.objectFit = 'cover';
    
    const label = document.createElement('span');
    label.innerHTML = '❤️'; 
    
    gridItem.appendChild(previewVideo);
    gridItem.appendChild(label);
    
    // Клик по превью возвращает на главную и плавно включает ролик
    gridItem.addEventListener('click', () => {
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.click();
        
        // Запускаем видео на ленте по его индексу
        setTimeout(() => {
            playVideoAtIndex(index);
        }, 150);
    });

    likedGrid.insertBefore(gridItem, likedGrid.firstChild);
}

// УДАЛЕНИЕ ВИДЕО ИЗ ВКЛАДКИ "ПОНРАВИЛОСЬ"
function removeFromLikedGrid(url) {
    if (!likedGrid) return;

    const targetItem = likedGrid.querySelector(`[data-video-url="${url}"]`);
    if (targetItem) {
        targetItem.remove();
    }
    
    if (likedGrid.children.length === 0) {
        likedGrid.innerHTML = `
            <div class="grid-item" id="liked-empty-msg" style="grid-column: span 3; background: transparent; font-size: 14px; color: #8a8a8f; text-align: center; padding: 40px 0;">
                Здесь будут видео, которые ты лайкнул! ❤️
            </div>
        `;
    }
}
