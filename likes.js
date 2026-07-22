// Логика лайков, двойного тапа и динамического добавления в список "Понравилось"

const videoArea = document.getElementById('video-area');
const heartBox = document.getElementById('heart-box');
const player = document.getElementById('main-player');
const likeBtnRight = document.getElementById('like-button-right');
const likeCountSpan = document.getElementById('like-count');
const likedGrid = document.getElementById('liked-grid');

let lastTap = 0;
// Хранилище залайканных ссылок в текущей сессии
let likedVideosList = {};

if (videoArea) {
    videoArea.addEventListener('click', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            handleDoubleTap(e);
            e.preventDefault();
        } else {
            setTimeout(() => {
                if (new Date().getTime() - lastTap >= 300) {
                    if (player && player.src) {
                        if (player.paused) player.play();
                        else player.pause();
                    }
                }
            }, 300);
        }
        lastTap = currentTime;
    });
}

// Клик по кнопке сердечка справа
window.toggleLike = function() {
    if (!player || !player.src) return; 
    
    likeBtnRight.classList.toggle('liked');
    let currentCount = parseInt(likeCountSpan.innerText);
    const videoURL = player.src;
    
    if (likeBtnRight.classList.contains('liked')) {
        likeCountSpan.innerText = currentCount + 1;
        addToLikedGrid(videoURL);
    } else {
        likeCountSpan.innerText = currentCount - 1;
        removeFromLikedGrid(videoURL);
    }
};

function handleDoubleTap(e) {
    if (likeBtnRight && !likeBtnRight.classList.contains('liked')) {
        window.toggleLike();
    }

    if (heartBox && videoArea) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';

        const rect = videoArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heartBox.appendChild(heart);

        setTimeout(() => { heart.remove(); }, 600);
    }
}

// ДОБАВЛЕНИЕ ВИДЕО ВО ВКЛАДКУ "ПОНРАВИЛОСЬ"
function addToLikedGrid(url) {
    if (!likedGrid) return;

    const emptyLikedMsg = document.getElementById('liked-empty-msg');
    if (emptyLikedMsg) emptyLikedMsg.remove();

    if (likedVideosList[url]) return;

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
    
    // Клик по превью возвращает на главную и запускает ролик
    gridItem.addEventListener('click', () => {
        const uploadHint = document.getElementById('upload-hint');
        if (player) {
            player.src = url;
            if (uploadHint) uploadHint.style.display = 'none';
            player.muted = false;
            player.load();
            player.play().catch(() => {});
        }
        if (likeBtnRight) likeBtnRight.classList.add('liked');
        if (likeCountSpan) likeCountSpan.innerText = "1";
        
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.click();
    });

    likedGrid.insertBefore(gridItem, likedGrid.firstChild);
    likedVideosList[url] = gridItem; 
}

// УДАЛЕНИЕ ВИДЕО ИЗ ВКЛАДКИ "ПОНРАВИЛОСЬ"
function removeFromLikedGrid(url) {
    if (!likedGrid) return;

    if (likedVideosList[url]) {
        likedVideosList[url].remove();
        delete likedVideosList[url];
    }
    
    if (likedGrid.children.length === 0) {
        likedGrid.innerHTML = `
            <div class="grid-item" id="liked-empty-msg" style="grid-column: span 3; background: transparent; font-size: 14px; color: #8a8a8f; text-align: center; padding: 40px 0;">
                Здесь будут видео, которые ты лайкнул! ❤️
            </div>
        `;
    }
}
