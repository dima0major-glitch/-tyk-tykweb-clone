// Логика лайков и двойного клика по экрану
const videoArea = document.getElementById('video-area');
const heartBox = document.getElementById('heart-box');
const player = document.getElementById('main-player');
const likeBtnRight = document.getElementById('like-button-right');
const likeCountSpan = document.getElementById('like-count');

let lastTap = 0;

// 1. Обработка кликов по экрану видео
videoArea.addEventListener('click', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    // Если разница между кликами меньше 300мс — это двойной тап (лайк)
    if (tapLength < 300 && tapLength > 0) {
        handleDoubleTap(e);
        e.preventDefault();
    } else {
        // Одиночный тап просто ставит на паузу или запускает
        setTimeout(() => {
            // Проверяем, не кликнул ли пользователь второй раз за это время
            if (new Date().getTime() - lastTap >= 300) {
                if (player.src) {
                    if (player.paused) player.play();
                    else player.pause();
                }
            }
        }, 300);
    }
    lastTap = currentTime;
});

// 2. Логика обычного нажатия на кнопку ❤️ справа
function toggleLike() {
    likeBtnRight.classList.toggle('liked');
    let currentCount = parseInt(likeCountSpan.innerText);
    
    if (likeBtnRight.classList.contains('liked')) {
        likeCountSpan.innerText = currentCount + 1;
    } else {
        likeCountSpan.innerText = currentCount - 1;
    }
}

// 3. Логика двойного тапа (вылет сердечка в месте клика)
function handleDoubleTap(e) {
    // Включаем лайк справа, если он еще не нажат
    if (!likeBtnRight.classList.contains('liked')) {
        toggleLike();
    }

    // Создаем элемент сердечка
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';

    // Получаем координаты клика относительно экрана телефона
    const rect = videoArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ставим сердечко ровно туда, куда нажал пользователь
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    // Добавляем на экран
    heartBox.appendChild(heart);

    // Удаляем сердечко из кода через 600мс, когда анимация закончится
    setTimeout(() => {
        heart.remove();
    }, 600);
}
