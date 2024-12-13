const editProfileButton = document.getElementById('editProfileButton');
const editProfileModal = document.getElementById('editProfileModal');
const closeModalButton = document.getElementById('closeModalButton');
const loadingOverlay = document.getElementById('loadingOverlay');

editProfileButton.addEventListener('click', () => {
    loadingOverlay.classList.remove('hidden');
    setTimeout(() => {
        loadingOverlay.classList.remove('opacity-0');
        loadingOverlay.classList.add('opacity-100');
        loadingOverlay.classList.add('pointer-events-auto');
    }, 10);
    editProfileModal.classList.remove('hidden');
    setTimeout(() => {
        editProfileModal.classList.remove('opacity-0');
        editProfileModal.classList.add('opacity-100');
        editProfileModal.classList.add('pointer-events-auto');
    }, 10);
});

closeModalButton.addEventListener('click', (event) => {
    event.preventDefault();
    editProfileModal.classList.remove('opacity-100');
    editProfileModal.classList.add('opacity-0');
    editProfileModal.classList.add('hidden');
    editProfileModal.classList.remove('pointer-events-auto');
    loadingOverlay.classList.remove('opacity-100');
    loadingOverlay.classList.add('opacity-0');
    loadingOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('pointer-events-auto');
});
