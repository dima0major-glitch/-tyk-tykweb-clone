// Логика загрузки видео и базового плеера
const plusBtn = document.getElementById('plus-btn');
const fileInput = document.getElementById('video-upload-input');
const videoPlayer = document.getElementById('main-player');
const uploadHint = document.getElementById('upload-hint');

// Открытие галереи при клике на [+]
plusBtn.addEventListener('click', () => {
    fileInput.click();
});

// Загрузка выбранного файла в плеер
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        videoPlayer.src = videoURL;
        uploadHint.style.display = 'none';
        videoPlayer.muted = false;
        videoPlayer.load();
        videoPlayer.play().catch(() => {});
        
        // Сбрасываем счетчик лайков для нового видео
        document.getElementById('like-count').innerText = "0";
        document.getElementById('like-button-right').classList.remove('liked');

        // Если загружали из профиля, автоматически переключаем на Главную
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.click();
    }
});

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
