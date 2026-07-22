// Модуль бесконечной ленты Tyk Tyk на базе Firebase Cloud
const fileInput = document.getElementById('video-upload-input');
const profileGrid = document.getElementById('profile-grid');
const feedContainer = document.getElementById('video-feed');

export let uploadedVideos = [];
export let activeVideoIndex = 0;
let isSoundGloballyEnabled = false;

document.addEventListener("DOMContentLoaded", () => {
    // Подключаем слушатель облачной базы данных
    listenToCloudFeed();
    setupUpload();
    setupAutoplayObserver();
    setupVideoTaps();
});

// Слушаем изменения в коллекции видео на сервере Firebase Firestore
function listenToCloudFeed() {
    if (!window.db) {
        console.error("Firebase еще не инициализирован");
        return;
    }

    const q = window.fbQuery(window.fbCollection(window.db, "videos"), window.fbOrderBy("createdAt", "desc"));
    
    window.fbOnSnapshot(q, (snapshot) => {
        uploadedVideos = [];
        snapshot.forEach((doc) => {
            uploadedVideos.push({ id: doc.id, ...doc.data() });
        });

        // Перерисовываем ленту и профиль из облака
        initFeed();
        updateProfileGrid();
    });
}

// Отрисовка карточек из облачных ссылок
export function initFeed() {
    if (!feedContainer) return;
    feedContainer.innerHTML = "";

    if (uploadedVideos.length === 0) {
        feedContainer.innerHTML = `
            <div class="no-video-msg" id="upload-hint" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px; color: #fff;">
                <h3>Лента пуста ☁️</h3>
                <br>
                <p>Нажми на кнопку <b>[+]</b> внизу и загрузи первое видео в облако Firebase!</p>
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
                    <span class="count like-count">${video.likes || 0}</span>
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
                <div class="description">${video.description || 'Загружено в облако!'}</div>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}
// Логика загрузки файла в Firebase Storage
function setupUpload() {
    if (!fileInput) return;
    
    fileInput.addEventListener('change', async function() {
        const file = this.files[0];
        if (!file) return;

        // Показываем индикатор загрузки, чтобы юзер видел прогресс
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.innerText = "⏳...";

        try {
            const currentTag = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dimka_0770";
            const fileRef = window.fbRef(window.storage, `videos/${Date.now()}_${file.name}`);
            
            // 1. Грузим физический файл в Storage
            const uploadResult = await window.fbUploadBytes(fileRef, file);
            // 2. Получаем вечную прямую HTTP-ссылку от Google
            const downloadUrl = await window.fbGetDownloadURL(uploadResult.ref);
            
            // 3. Пишем метаданные в базу Firestore
            await window.fbAddDoc(window.fbCollection(window.db, "videos"), {
                url: downloadUrl,
                author: currentTag,
                description: `Ролик в облаке Tyk Tyk! 🚀`,
                likes: 0,
                isLiked: false,
                comments: [],
                createdAt: Date.now()
            });

            console.log("Видео успешно обработано и сохранено на сервере!");
        } catch (error) {
            console.error("Критическая ошибка загрузки в облако:", error);
            alert("Не удалось загрузить. Убедись, что в Firebase Console включены Storage и Firestore без авторизации.");
        } finally {
            if (btnHome) btnHome.innerHTML = "<span class='nav-icon'>🏠</span><span>Главная</span>";
            if (btnHome) btnHome.click();
        }
    });
}

function updateProfileGrid() {
    if (!profileGrid) return;
    profileGrid.innerHTML = "";
    
    const emptyMsg = document.getElementById('grid-empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const currentTag = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dimka_0770";
    
    uploadedVideos.forEach((video, index) => {
        if (video.author === currentTag) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            const previewVideo = document.createElement('video');
            previewVideo.src = video.url;
            previewVideo.muted = true;
            previewVideo.playsInline = true;
            previewVideo.webkitPlaysInline = true;
            previewVideo.style.width = '100%';
            previewVideo.style.height = '100%';
            previewVideo.style.objectFit = 'cover';
            
            const viewsLabel = document.createElement('span');
            viewsLabel.innerHTML = '🎬 云'; 
            
            gridItem.appendChild(previewVideo);
            gridItem.appendChild(viewsLabel);
            
            gridItem.addEventListener('click', () => {
                const btnHome = document.getElementById('btn-home');
                if (btnHome) btnHome.click();
                setTimeout(() => playVideoAtIndex(index), 200);
            });

            profileGrid.appendChild(gridItem);
        }
    });
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
