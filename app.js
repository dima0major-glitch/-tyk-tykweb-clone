// Стабильная лента с автоплеем, контролем звука и сохранением видео в Base64 для iPhone
const fileInput = document.getElementById('video-upload-input');
const profileGrid = document.getElementById('profile-grid');
const feedContainer = document.getElementById('video-feed');

// Загружаем сохраненную ленту из LocalStorage
export let uploadedVideos = JSON.parse(localStorage.getItem('tyk_tyk_videos_state')) || [];
export let activeVideoIndex = 0;
let isSoundGloballyEnabled = false;

document.addEventListener("DOMContentLoaded", () => {
    initFeed();
    setupUpload();
    setupAutoplayObserver();
    setupVideoTaps();
    
    // Восстанавливаем сетку профиля из сохраненных Base64 данных
    if (uploadedVideos.length > 0 && profileGrid) {
        const emptyMsg = document.getElementById('grid-empty-msg');
        if (emptyMsg) emptyMsg.remove();
        profileGrid.innerHTML = "";
        uploadedVideos.forEach((video, index) => {
            createProfileGridItem(video.url, index);
        });
    }
});

// Отрисовка карточек ленты
export function initFeed() {
    if (!feedContainer) return;
    feedContainer.innerHTML = "";

    if (uploadedVideos.length === 0) {
        feedContainer.innerHTML = `
            <div class="no-video-msg" id="upload-hint" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px; color: #fff;">
                <h3>Добро пожаловать в Tyk Tyk! 👋</h3>
                <br>
                <p>Нажми на кнопку <b>[+]</b> внизу и выбери видео из галереи своего iPhone!</p>
            </div>
        `;
        return;
    }

    uploadedVideos.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.setAttribute("data-index", index);
        card.style.width = "100%";
        card.style.height = "100%";
        card.style.scrollSnapAlign = "start";
        card.style.position = "relative";

        card.innerHTML = `
            <div class="video-click-area" data-index="${index}" style="width:100%; height:100%; position:absolute; top:0; left:0; z-index:1;">
                <video src="${video.url}" loop muted playsinline webkit-playsinline style="width:100%; height:100%; object-fit:cover;"></video>
                <div class="heart-animation-container"></div>
            </div>
            
            <div class="action-buttons" style="z-index:2; position:absolute;">
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

            <div class="video-sidebar" style="z-index:2; position:absolute;">
                <div class="username">${video.author || '@dimka_0770'}</div>
                <div class="description">${video.description}</div>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}
// Изменено: Используем FileReader для перевода видео в вечную Base64 строку
function setupUpload() {
    if (!fileInput) return;
    
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const base64Video = event.target.result;
                const currentTag = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dimka_0770";
                
                const newVideo = {
                    id: Date.now().toString(),
                    url: base64Video, // Теперь тут хранится вечный код видео
                    author: currentTag,
                    description: `Ролик #${uploadedVideos.length + 1} в ленте! 🔥`,
                    likes: 0,
                    isLiked: false,
                    comments: []
                };
                
                uploadedVideos.push(newVideo);
                localStorage.setItem('tyk_tyk_videos_state', JSON.stringify(uploadedVideos));
                
                initFeed();

                const emptyMsg = document.getElementById('grid-empty-msg');
                if (emptyMsg) emptyMsg.remove();

                createProfileGridItem(base64Video, uploadedVideos.length - 1);

                const newIndex = uploadedVideos.length - 1;
                setTimeout(() => playVideoAtIndex(newIndex), 300);

                const btnHome = document.getElementById('btn-home');
                if (btnHome) btnHome.click();
            };
            
            reader.readAsDataURL(file); // Запуск конвертации видео файла
        }
    });
}

function createProfileGridItem(url, index) {
    if (!profileGrid) return;

    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute('data-index', index);
    
    const previewVideo = document.createElement('video');
    previewVideo.src = url;
    previewVideo.muted = true;
    previewVideo.playsInline = true;
    previewVideo.webkitPlaysInline = true;
    previewVideo.style.width = '100%';
    previewVideo.style.height = '100%';
    previewVideo.style.objectFit = 'cover';
    
    const viewsLabel = document.createElement('span');
    viewsLabel.innerHTML = '🎬 新'; 
    
    gridItem.appendChild(previewVideo);
    gridItem.appendChild(viewsLabel);
    
    gridItem.addEventListener('click', () => {
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.click();
        setTimeout(() => playVideoAtIndex(index), 200);
    });

    profileGrid.insertBefore(gridItem, profileGrid.firstChild);
}

export function playVideoAtIndex(index) {
    const cards = document.querySelectorAll("#video-feed .video-card");
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth", block: "start" });
        
        document.querySelectorAll("#video-feed video").forEach(v => {
            v.pause();
            v.muted = true;
        });

        const video = cards[index].querySelector("video");
        if (video) {
            video.muted = !isSoundGloballyEnabled; 
            video.play().catch(() => {
                video.muted = true;
                video.play().catch(() => {});
            });
        }
        activeVideoIndex = index;
    }
}

function setupAutoplayObserver() {
    if (!feedContainer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector("video");
            const index = parseInt(entry.target.getAttribute("data-index"));

            if (entry.isIntersecting && video) {
                video.muted = !isSoundGloballyEnabled; 
                video.play().catch(() => {
                    video.muted = true;
                    video.play().catch(() => {});
                });
                activeVideoIndex = index;
            } else if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, { threshold: 0.6 });

    const mutationObserver = new MutationObserver(() => {
        document.querySelectorAll("#video-feed .video-card").forEach(card => observer.observe(card));
    });
    mutationObserver.observe(feedContainer, { childList: true });
    
    document.querySelectorAll("#video-feed .video-card").forEach(card => observer.observe(card));
}

let lastTapTime = 0;
function setupVideoTaps() {
    if (!feedContainer) return;

    feedContainer.addEventListener('click', (e) => {
        const clickArea = e.target.closest('.video-click-area');
        if (!clickArea) return;

        const card = clickArea.closest('.video-card');
        const video = card.querySelector('video');
        if (!video) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength > 300 || tapLength === 0) {
            setTimeout(() => {
                const innerCurrentTime = new Date().getTime();
                if (innerCurrentTime - lastTapTime >= 300) {
                    if (video.muted) {
                        video.muted = false;
                        isSoundGloballyEnabled = true;
                    } else {
                        if (video.paused) {
                            video.play().catch(() => {});
                        } else {
                            video.pause();
                        }
                    }
                }
            }, 300);
        }
        lastTapTime = currentTime;
    });
}

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
