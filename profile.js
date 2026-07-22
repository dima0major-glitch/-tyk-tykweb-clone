import { uploadedVideos, activeVideoIndex, initFeed } from './app.js';

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupProfileTabs();
});

function setupNavigation() {
    const homeBtn = document.getElementById("btn-home");
    const profileBtn = document.getElementById("btn-profile");
    const feedScreen = document.getElementById("screen-feed");
    const profileScreen = document.getElementById("screen-profile");

    if (homeBtn && profileBtn && feedScreen && profileScreen) {
        homeBtn.addEventListener("click", () => {
            homeBtn.classList.add("active");
            profileBtn.classList.remove("active");
            
            feedScreen.classList.remove("hidden");
            profileScreen.classList.add("hidden");
            
            // Запускаем видео на текущем индексе при возврате на главную
            const activeCard = document.querySelector(`#video-feed .video-card[data-index="${activeVideoIndex}"] video`);
            if (activeCard) {
                activeCard.play().catch(() => {});
            }
        });

        profileBtn.addEventListener("click", () => {
            profileBtn.classList.add("active");
            homeBtn.classList.remove("active");
            
            profileScreen.classList.remove("hidden");
            feedScreen.classList.add("hidden");

            // Ставим на паузу все ролики из ленты
            document.querySelectorAll("#video-feed video").forEach(v => v.pause());
        });
    }
}

function setupProfileTabs() {
    const tabMy = document.getElementById("tab-my-videos");
    const tabLiked = document.getElementById("tab-liked-videos");
    const galleryMy = document.getElementById("profile-grid");
    const galleryLiked = document.getElementById("liked-grid");

    if (tabMy && tabLiked) {
        tabMy.addEventListener("click", () => {
            tabMy.classList.add("active");
            tabLiked.classList.remove("active");
            if (galleryMy) galleryMy.classList.remove("hidden");
            if (galleryLiked) galleryLiked.classList.add("hidden");
        });

        tabLiked.addEventListener("click", () => {
            tabLiked.classList.add("active");
            tabMy.classList.remove("active");
            if (galleryLiked) galleryLiked.classList.remove("hidden");
            if (galleryMy) galleryMy.classList.add("hidden");
        });
    }
}
