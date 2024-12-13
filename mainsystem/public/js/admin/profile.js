const editProfileButton = document.getElementById('editProfileButton');
const editProfileModal = document.getElementById('editProfileModal');
const closeModalButton = document.getElementById('closeModalButton');

editProfileButton.addEventListener('click', () => {
    editProfileModal.classList.remove('hidden');
    setTimeout(() => {
        editProfileModal.classList.remove('opacity-0');
        editProfileModal.classList.add('opacity-100');
        editProfileModal.classList.add('pointer-events-auto');
    }, 10);
});

closeModalButton.addEventListener('click', () => {
    editProfileModal.classList.remove('opacity-100');
    editProfileModal.classList.add('opacity-0');
    setTimeout(() => {
        editProfileModal.classList.add('hidden');
        editProfileModal.classList.remove('pointer-events-auto');
    }, 300);
});