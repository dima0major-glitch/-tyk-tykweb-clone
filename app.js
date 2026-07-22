// Стабильная логика загрузки видео и базового плеера для iOS
const fileInput = document.getElementById('video-upload-input');
const videoPlayer = document.getElementById('main-player');
const uploadHint = document.getElementById('upload-hint');
const profileGrid = document.getElementById('profile-grid');

// Массив для хранения всех загруженных видео-ссылок
let uploadedVideos = [];

// Логика подгрузки твоего видео в плеер
if (fileInput) {
    fileInput.addEventListener('change', function() {
        const file = this.files[0]; // Берем первый выбранный файл напрямую
        if (file) {
            // Создаем локальную временную ссылку на файл из галереи Айфона
            const videoURL = URL.createObjectURL(file);
            
            // Сохраняем ссылку в наш массив
            uploadedVideos.push(videoURL);
            
            // Включаем видео в главном плеере
            playSelectedVideo(videoURL);

            // Удаляем надпись "Нет видео", если она есть на экране профиля
            const emptyMsg = document.getElementById('grid-empty-msg');
            if (emptyMsg) {
                emptyMsg.remove();
            }

            // Создаем элемент миниатюры для сетки профиля
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            // Создаем маленькое видео без звука для превью
            const previewVideo = document.createElement('video');
            previewVideo.src = videoURL;
            previewVideo.muted = true;
            previewVideo.playsInline = true;
            previewVideo.style.width = '100%';
            previewVideo.style.height = '100%';
            previewVideo.style.objectFit = 'cover';
            
            // Маленький значок просмотров поверх видео
            const viewsLabel = document.createElement('span');
            viewsLabel.innerHTML = '🎬 新'; 
            
            gridItem.appendChild(previewVideo);
            gridItem.appendChild(viewsLabel);
            
            // Клик по превью в профиле запускает это видео в плеере
            gridItem.addEventListener('click', () => {
                playSelectedVideo(videoURL);
            });

            // Вставляем новое видео в самое начало сетки профиля
            if (profileGrid) {
                profileGrid.insertBefore(gridItem, profileGrid.firstChild);
            }
        }
    });
}

// Функция запуска конкретного видео на главном экране
function playSelectedVideo(url) {
    if (videoPlayer) {
        videoPlayer.src = url;
        if (uploadHint) uploadHint.style.display = 'none';
        videoPlayer.muted = false; // Сразу включаем звук при ручной загрузке
        videoPlayer.load();
        
        // Жесткий запуск для iOS Safari
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("iOS заблокировал автоплей, нужен тап по экрану:", error);
            });
        }
    }
    
    // Сброс лайков справа для нового ролика
    const likeCountSpan = document.getElementById('like-count');
    const likeBtnRight = document.getElementById('like-button-right');
    if (likeCountSpan) likeCountSpan.innerText = "0";
    if (likeBtnRight) likeBtnRight.classList.remove('liked');

    // Автоматически перенаправляем пользователя на главную ленту
    const btnHome = document.getElementById('btn-home');
    if (btnHome) btnHome.click();
}

// Функция "Поделиться"
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
