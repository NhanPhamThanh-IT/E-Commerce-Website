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

document.getElementById('avatarInput').addEventListener('change', () => {
    const uploadButton = document.getElementById('avatarInput');
    const avatarImg = document.getElementById('avatar');

    if (uploadButton.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', uploadButton.files[0]);

        fetch(`/admin/profile/upload-avatar`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to upload avatar.');
                }
            })
            .then((data) => {
                alert(data.message);
                avatarImg.src = data.avatarUrl;
            })
            .catch((error) => console.error('Error uploading avatar:', error));
    }
});