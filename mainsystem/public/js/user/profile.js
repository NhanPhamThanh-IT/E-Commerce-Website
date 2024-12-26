const uploadButton = document.getElementById('avatarInput');
const avatarImg = document.getElementById('avatar');

uploadButton.addEventListener('change', () => {
    if (uploadButton.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', uploadButton.files[0]);

        fetch('/upload-avatar', {
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

document.addEventListener('DOMContentLoaded', function () {
    const birthDateInput = document.getElementById('birthDate');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');

    const today = new Date();
    const maxDateString = today.toISOString().split('T')[0];
    birthDateInput.setAttribute('max', maxDateString);

    function validatePhoneNumber(phone) {
        const phonePattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
        return phonePattern.test(phone);
    }

    document.getElementById('profileForm').addEventListener('submit', function (event) {
        if (!validatePhoneNumber(phoneInput.value)) {
            phoneError.classList.remove('hidden');
            event.preventDefault();
        } else {
            phoneError.classList.add('hidden');
        }
    });
});