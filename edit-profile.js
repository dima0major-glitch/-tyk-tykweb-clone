// Логика управления профилем с интеграцией LocalStorage (память iPhone)

const editProfileBtn = document.querySelector('.edit-btn');
const modalOverlay = document.getElementById('edit-profile-modal');
const btnCancel = document.getElementById('btn-modal-cancel');
const btnSave = document.getElementById('btn-modal-save');

const inputName = document.getElementById('input-name');
const inputTag = document.getElementById('input-tag');
const inputAvatar = document.getElementById('input-avatar');

const profileNameDisplay = document.querySelector('.profile-username');
const profileTagDisplay = document.querySelector('.profile-tag');
const profileAvatarDisplay = document.querySelector('.profile-avatar');

// 1. Загрузка данных профиля из памяти Айфона при старте приложения
function loadProfileData() {
    const savedProfile = JSON.parse(localStorage.getItem('tyk_tyk_profile'));
    
    // Если в памяти телефона уже есть сохраненные данные — подставляем их
    if (savedProfile) {
        if (savedProfile.name) profileNameDisplay.innerText = savedProfile.name;
        if (savedProfile.tag) profileTagDisplay.innerText = savedProfile.tag;
        if (savedProfile.avatar) profileAvatarDisplay.innerText = savedProfile.avatar;
    }
}

// 2. Открытие окна при нажатии на кнопку "Изменить профиль"
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        inputName.value = profileNameDisplay.innerText;
        inputTag.value = profileTagDisplay.innerText.replace('@', '');
        inputAvatar.value = profileAvatarDisplay.innerText;
        
        modalOverlay.classList.remove('hidden');
    });
}

// 3. Закрытие окна по кнопке "Отмена"
btnCancel.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

// 4. Сохранение данных в память телефона
btnSave.addEventListener('click', () => {
    const newName = inputName.value.trim();
    const newTag = inputTag.value.trim();
    const newAvatar = inputAvatar.value.trim();

    if (newName === "" || newTag === "") {
        alert("Имя и тег не могут быть пустыми!");
        return;
    }

    // Создаем объект профиля для сохранения
    const profileData = {
        name: newName,
        tag: `@${newTag}`,
        avatar: newAvatar !== "" ? newAvatar : "😎"
    };

    // Записываем в LocalStorage смартфона
    localStorage.setItem('tyk_tyk_profile', JSON.stringify(profileData));

    // Сразу же обновляем текст на самом экране
    loadProfileData();

    // Закрываем окно
    modalOverlay.classList.add('hidden');
});

// Запускаем проверку сохраненного профиля сразу при загрузке сайта
loadProfileData();
