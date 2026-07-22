// Логика загрузки видео, базового плеера и динамической сетки
const plusBtn = document.getElementById('plus-btn');
const fileInput = document.getElementById('video-upload-input');
const videoPlayer = document.getElementById('main-player');
const uploadHint = document.getElementById('upload-hint');
const profileGrid = document.getElementById('profile-grid');
const emptyMsg = document.getElementById('grid-empty-msg');

// Массив для хранения всех загруженных видео-ссылок в памяти
let uploadedVideos = [];

// Открытие галереи при клике на [+]
plusBtn.addEventListener('click', () => {
    fileInput.click();
});

// Загрузка выбранного файла в плеер и добавление в профиль
fileInput.addEventListener('change', function() {
    const file = this.files[0]; // Берем первый выбранный файл
    if (file) {
        const videoURL = URL.createObjectURL(file);
        
        // Сохраняем ссылку в наш массив
        uploadedVideos.push(videoURL);
        
        // Включаем видео в главном плеере
        playSelectedVideo(videoURL);

        // Удаляем надпись "Нет видео", если она есть
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
        
        // Маленький значок просмотров поверх видео, как в TikTok
        const viewsLabel = document.createElement('span');
        viewsLabel.innerHTML = '🎬 新'; // Значок нового видео
        
        // Добавляем видео и значок в карточку сетки
        gridItem.appendChild(previewVideo);
        gridItem.appendChild(viewsLabel);
        
        // Делаем карточку кликабельной: при нажатии включается это видео в плеере
        gridItem.addEventListener('click', () => {
            playSelectedVideo(videoURL);
        });

        // Вставляем новое видео в самое начало сетки профиля
        profileGrid.insertBefore(gridItem, profileGrid.firstChild);
    }
});

// Функция запуска конкретного видео на главном экране
function playSelectedVideo(url) {
    videoPlayer.src = url;
    if (uploadHint) uploadHint.style.display = 'none';
    videoPlayer.muted = false;
    videoPlayer.load();
    videoPlayer.play().catch(() => {});
    
    // Сбрасываем счетчик лайков справа для нового ролика
    document.getElementById('like-count').innerText = "0";
    document.getElementById('like-button-right').classList.remove('liked');

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
