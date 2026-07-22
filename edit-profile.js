// Логика управления окном редактирования профиля

// Кнопка на странице профиля
const editProfileBtn = document.querySelector('.edit-btn');

// Элементы модального окна
const modalOverlay = document.getElementById('edit-profile-modal');
const btnCancel = document.getElementById('btn-modal-cancel');
const btnSave = document.getElementById('btn-modal-save');

// Поля ввода в окне
const inputName = document.getElementById('input-name');
const inputTag = document.getElementById('input-tag');
const inputAvatar = document.getElementById('input-avatar');

// Элементы на самом экране профиля (куда сохраняем)
const profileNameDisplay = document.querySelector('.profile-username');
const profileTagDisplay = document.querySelector('.profile-tag');
const profileAvatarDisplay = document.querySelector('.profile-avatar');

// 1. Открытие окна при нажатии на кнопку "Изменить профиль"
editProfileBtn.addEventListener('click', () => {
    // Подставляем текущие значения из профиля в поля ввода, чтобы не писать заново
    inputName.value = profileNameDisplay.innerText;
    inputTag.value = profileTagDisplay.innerText.replace('@', ''); // Убираем собачку для ввода
    inputAvatar.value = profileAvatarDisplay.innerText;
    
    // Показываем окно
    modalOverlay.classList.remove('hidden');
});

// 2. Закрытие окна по кнопке "Отмена"
btnCancel.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

// 3. Сохранение данных по кнопке "Сохранить"
btnSave.addEventListener('click', () => {
    const newName = inputName.value.trim();
    const newTag = inputTag.value.trim();
    const newAvatar = inputAvatar.value.trim();

    // Проверяем, чтобы поля не были пустыми
    if (newName === "" || newTag === "") {
        alert("Имя и тег не могут быть пустыми!");
        return;
    }

    // Обновляем текст прямо на экране профиля
    profileNameDisplay.innerText = newName;
    profileTagDisplay.innerText = `@${newTag}`;
    
    // Если ввели эмодзи для аватарки — обновляем её
    if (newAvatar !== "") {
        profileAvatarDisplay.innerText = newAvatar;
    }

    // Закрываем окно
    modalOverlay.classList.add('hidden');
});
