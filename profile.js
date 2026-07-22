// Логика управления экраном профиля
const btnHome = document.getElementById('btn-home');
const btnProfile = document.getElementById('btn-profile');
const screenFeed = document.getElementById('screen-feed');
const screenProfile = document.getElementById('screen-profile');
const mainVideo = document.getElementById('main-player');

// Переход в профиль
btnProfile.addEventListener('click', () => {
    btnHome.classList.remove('active');
    btnProfile.classList.add('active');
    
    screenFeed.classList.add('hidden');
    screenProfile.classList.remove('hidden');
    
    // Ставим видео на паузу, чтобы звук не мешал в профиле
    if(mainVideo) mainVideo.pause();
});

// Возврат на главную ленту
btnHome.addEventListener('click', () => {
    btnProfile.classList.remove('active');
    btnHome.classList.add('active');
    
    screenProfile.classList.add('hidden');
    screenFeed.classList.remove('hidden');
    
    // Включаем видео обратно, если оно загружено
    if(mainVideo && mainVideo.src) {
        mainVideo.play().catch(() => {});
    }
});
