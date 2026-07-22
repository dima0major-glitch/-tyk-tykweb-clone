// Логика управления экраном профиля и переключения вкладок

const btnHome = document.getElementById('btn-home');
const btnProfile = document.getElementById('btn-profile');
const screenFeed = document.getElementById('screen-feed');
const screenProfile = document.getElementById('screen-profile');
const mainVideo = document.getElementById('main-player');

// Переключатели вкладок внутри самого профиля
const tabMyVideos = document.getElementById('tab-my-videos');
const tabLikedVideos = document.getElementById('tab-liked-videos');
const gridMyVideos = document.getElementById('profile-grid');
const gridLikedVideos = document.getElementById('liked-grid');

// 1. Переход в профиль
if (btnProfile) {
    btnProfile.addEventListener('click', () => {
        btnHome.classList.remove('active');
        btnProfile.classList.add('active');
        
        screenFeed.classList.add('hidden');
        screenProfile.classList.remove('hidden');
        
        if (mainVideo) mainVideo.pause();
    });
}

// 2. Возврат на главную ленту
if (btnHome) {
    btnHome.addEventListener('click', () => {
        btnProfile.classList.remove('active');
        btnHome.classList.add('active');
        
        screenProfile.classList.add('hidden');
        screenFeed.classList.remove('hidden');
        
        if (mainVideo && mainVideo.src) {
            mainVideo.play().catch(() => {});
        }
    });
}

// 3. Клик на вкладку "Мои Видео" внутри профиля
if (tabMyVideos) {
    tabMyVideos.addEventListener('click', () => {
        if (tabLikedVideos && gridLikedVideos && gridMyVideos) {
            tabLikedVideos.classList.remove('active');
            tabMyVideos.classList.add('active');
            
            gridLikedVideos.classList.add('hidden');
            gridMyVideos.classList.remove('hidden');
        }
    });
}

// 4. Клик на вкладку "Понравилось" внутри профиля
if (tabLikedVideos) {
    tabLikedVideos.addEventListener('click', () => {
        if (tabMyVideos && gridMyVideos && gridLikedVideos) {
            tabMyVideos.classList.remove('active');
            tabLikedVideos.classList.add('active');
            
            gridMyVideos.classList.add('hidden');
            gridLikedVideos.classList.remove('hidden');
        }
    });
}
