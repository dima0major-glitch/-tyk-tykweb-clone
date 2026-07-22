// Стабильная логика динамической вертикальной бесконечной ленты для iOS
const fileInput = document.getElementById('video-upload-input');
const profileGrid = document.getElementById('profile-grid');
const feedContainer = document.getElementById('video-feed');

// Экспортируем массив для доступа из других модулей (likes.js, comments.js)
export let uploadedVideos = [];
export let activeVideoIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initFeed();
    setupUpload();
    setupAutoplayObserver();
});

// Инициализация ленты: если видео нет — показываем твою подсказку
function initFeed() {
    if (!feedContainer) return;
    feedContainer.innerHTML = "";

    if (uploadedVideos.length === 0) {
        feedContainer.innerHTML = `
            <div class="no-video-msg" id="upload-hint" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
                <h3>Добро пожаловать в Tyk Tyk! 👋</h3>
                <br>
                <p>Нажми на кнопку <b>[+]</b> внизу и выбери видео из галереи своего iPhone!</p>
            </div>
        `;
        return;
    }

    // Собираем ленту из массива роликов, используя твои оригинальные классы
    uploadedVideos.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.setAttribute("data-index", index);
        card.style.width = "100%";
        card.style.height = "100%";
        card.style.scrollSnapAlign = "start";
        card.style.position = "relative";

        card.innerHTML = `
            <div class="video-click-area" data-index="${index}">
                <video src="${video.url}" loop playsinline style="width:100%; height:100%; object-fit:cover;"></video>
                <div class="heart-animation-container"></div>
            </div>
            
            <div class="action-buttons">
                <div class="button-item like-btn ${video.isLiked ? 'liked' : ''}" data-index="${index}">
                    <div class="button-icon">${video.isLiked ? '❤️' : '🤍'}</div>
                    <span class="count like-count">${video.likes}</span>
                </div>
                <div class="button-item comment-btn" data-index="${index}">
                    <div class="button-icon">💬</div>
                    <span class="count comment-count">${video.comments ? video.comments.length : 0}</span>
                </div>
                <div class="button-item share-btn">
                    <div class="button-icon">➡️</div>
                    <span class="count">Поделиться</span>
                </div>
            </div>

            <div class="video-sidebar">
                <div class="username">${video.author}</div>
                <div class="description">${video.description}</div>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}

// Слушатель загрузки видео через [+]
function setupUpload() {
    if (!fileInput) return;
    
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            
            // Создаем структурированный объект ролика
            const newVideo = {
                id: Date.now().toString(),
                url: videoURL,
                author: '@dima0major',
                description: `Твой личный Tyk Tyk. Ролик #${uploadedVideos.length + 1} в ленте! 🔥`,
                likes: 0,
                isLiked: false,
                comments: []
            };
            
            uploadedVideos.push(newVideo);
            
            // Перестраиваем ленту
            initFeed();

            // Удаляем заглушку из профиля
            const emptyMsg = document.getElementById('grid-empty-msg');
            if (emptyMsg) emptyMsg.remove();

            // Добавляем миниатюру в профиль
            createProfileGridItem(videoURL, uploadedVideos.length - 1);

            // Мгновенно скроллим к новому видео и запускаем его
            const newIndex = uploadedVideos.length - 1;
            setTimeout(() => playVideoAtIndex(newIndex), 200);

            // Перенаправляем на Главную ленту через твою кнопку
            const btnHome = document.getElementById('btn-home');
            if (btnHome) btnHome.click();
        }
    });
}

// Создание миниатюры в профиле
function createProfileGridItem(url, index) {
    if (!profileGrid) return;

    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    
    const previewVideo = document.createElement('video');
    previewVideo.src = url;
    previewVideo.muted = true;
    previewVideo.playsInline = true;
    previewVideo.style.width = '100%';
    previewVideo.style.height = '100%';
    previewVideo.style.objectFit = 'cover';
    
    const viewsLabel = document.createElement('span');
    viewsLabel.innerHTML = '🎬 新'; 
    
    gridItem.appendChild(previewVideo);
    gridItem.appendChild(viewsLabel);
    
    // Клик по плитке в профиле плавно переключит ленту на этот ролик
    gridItem.addEventListener('click', () => {
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.click();
        setTimeout(() => playVideoAtIndex(index), 100);
    });

    profileGrid.insertBefore(gridItem, profileGrid.firstChild);
}

// Плавный скролл и запуск видео на ленте по индексу
export function playVideoAtIndex(index) {
    const cards = document.querySelectorAll("#video-feed .video-card");
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth" });
        const video = cards[index].querySelector("video");
        if (video) {
            video.muted = false;
            video.play().catch(() => {});
        }
    }
}

// Наблюдатель автоматического включения/выключения звука и плеера при свайпе
function setupAutoplayObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector("video");
            const index = parseInt(entry.target.getAttribute("data-index"));

            if (entry.isIntersecting && video) {
                video.muted = false;
                video.play().catch(() => {});
                activeVideoIndex = index;
            } else if (video) {
                video.pause();
                video.currentTime = 0; // Сброс на начало
            }
        });
    }, { threshold: 0.8 }); // Видео активируется, если видно на 80% экрана

    const mutationObserver = new MutationObserver(() => {
        document.querySelectorAll("#video-feed .video-card").forEach(card => observer.observe(card));
    });
    mutationObserver.observe(feedContainer, { childList: true });
}

// Глобальный маршрутизатор кликов по ленте (Поделиться)
if (feedContainer) {
    feedContainer.addEventListener('click', (e) => {
        if (e.target.closest('.share-btn')) {
            shareVideo();
        }
    });
}

function shareVideo() {
    if (navigator.share) {
        navigator.share({
            title: 'Смотри Tyk Tyk!',
            url: window.location.href
        }).catch(() => {});
    } else {
        alert('Ссылка скопирована!');
    }
}
