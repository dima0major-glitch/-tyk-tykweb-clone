// Финальный автономный модуль ленты Supabase со строгим чтением файлов iOS
const fileInput = document.getElementById('video-upload-input');
const profileGrid = document.getElementById('profile-grid');
const feedContainer = document.getElementById('video-feed');

window.uploadedVideos = [];
window.activeVideoIndex = 0;
let isSoundGloballyEnabled = false;

document.addEventListener("DOMContentLoaded", () => {
    // Цикл ожидания, пока загрузится конфигурация базы Supabase
    const checkSupabase = setInterval(() => {
        if (window.supabase) {
            clearInterval(checkSupabase);
            listenToCloudFeed(); 
        }
    }, 100);

    setupUpload();
    setupAutoplayObserver();
    setupVideoTaps();
});

async function listenToCloudFeed() {
    if (!window.supabase) return;

    const { data, error } = await window.supabase
        .from('videos')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) {
        console.error("Ошибка загрузки ленты:", error.message);
        return;
    }

    window.uploadedVideos = data || [];
    initFeed();
    updateProfileGrid();
}

function initFeed() {
    if (!feedContainer) return;
    feedContainer.innerHTML = "";

    if (window.uploadedVideos.length === 0) {
        feedContainer.innerHTML = `
            <div class="no-video-msg" id="upload-hint" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px; color: #fff;">
                <h3>Лента пуста ☁️</h3>
                <br>
                <p>Нажми на кнопку <b>[+]</b> внизу и загрузи первое видео в Supabase!</p>
            </div>
        `;
        return;
    }

    window.uploadedVideos.forEach((video, index) => {
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
                <div class="button-item like-btn" data-index="${index}">
                    <div class="button-icon">🤍</div>
                    <span class="count like-count">${video.likes || 0}</span>
                </div>
                <div class="button-item comment-btn" data-index="${index}">
                    <div class="button-icon">💬</div>
                    <span class="count comment-count">0</span>
                </div>
                <div class="button-item share-btn">
                    <div class="button-icon">➡️</div>
                    <span class="count">Поделиться</span>
                </div>
            </div>

            <div class="video-sidebar" style="z-index:2; position:absolute;">
                <div class="username">${video.author || '@dimka_0770'}</div>
                <div class="description">${video.description || 'Стриминг из Supabase! 🎬'}</div>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}
function setupUpload() {
    if (!fileInput) return;
    
    fileInput.addEventListener('change', async function() {
        // УКАЗАНО СТРОГО: Берем первый конкретный файл из массива [0] (Победа над алертом!)
        const file = this.files[0]; 
        if (!file || !window.supabase) return;

        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.innerText = "⏳...";

        try {
            const currentTag = document.querySelector('.profile-tag') ? document.querySelector('.profile-tag').innerText : "@dimka_0770";
            const fileName = `${Date.now()}_${file.name}`;

            // Отправка файла в бакет Storage Supabase
            const { data: storageData, error: storageError } = await window.supabase
                .storage
                .from('videos')
                .upload(fileName, file);

            if (storageError) throw storageError;

            // Генерация публичной ссылки на видеофайл
            const { data: urlData } = window.supabase
                .storage
                .from('videos')
                .getPublicUrl(fileName);

            const publicUrl = urlData.publicUrl;

            // Запись данных в таблицу нашей базы данных
            const { error: dbError } = await window.supabase
                .from('videos')
                .insert([
                    {
                        url: publicUrl,
                        author: currentTag,
                        description: `Новый хит в облачной ленте! 🔥`,
                        likes: 0,
                        isLiked: false,
                        comments: [],
                        createdAt: new Date().toISOString()
                    }
                ]);

            if (dbError) throw dbError;

            console.log("Видео успешно сохранено на сервере!");
            listenToCloudFeed(); 
            
        } catch (error) {
            console.error("Ошибка загрузки:", error.message);
            alert("Не удалось загрузить видео. Проверь бакет!");
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
    
    window.uploadedVideos.forEach((video, index) => {
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
                setTimeout(() => window.playVideoAtIndex(index), 200);
            });

            profileGrid.appendChild(gridItem);
        }
    });
}

window.playVideoAtIndex = function(index) {
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
        window.activeVideoIndex = index;
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
                window.activeVideoIndex = index;
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
