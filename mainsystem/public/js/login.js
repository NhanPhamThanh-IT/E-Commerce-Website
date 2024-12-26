const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

togglePassword.addEventListener('click', function () {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = {
        email: email,
        password: password
    };
    console.log('Form data:', formData);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        console.log('Response:', response);

        if (response.ok) {
            showAlert('Login successful!', 'success');
            setTimeout(function () {
                window.location.href = '/homepage';
            }, 600);
        } else {
            const errorData = await response.json();
            showAlert(`Error: ${errorData.desc || errorData.message || 'Login failed'}`, 'error');
        }
    } catch (error) {
        showAlert('Something went wrong. Please try again later.', 'error');
    }
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const alertCloseBtn = document.getElementById('alertCloseBtn');
    alertMessage.textContent = message;
    alertBox.classList.remove('hidden');
    if (type === 'success') {
        alertMessage.classList.add('text-green-600');
        alertCloseBtn.classList.add('bg-green-500');
    } else if (type === 'error') {
        alertMessage.classList.add('text-red-600');
        alertCloseBtn.classList.add('bg-red-500');
    }
    alertCloseBtn.onclick = function () {
        alertBox.classList.add('hidden');
        stopSnowflakes();
    };
    createSnowflakes();
}

function createSnowflakes() {
    const snowflakes = [];
    const numberOfSnowflakes = 50;
    const snowContainer = document.createElement('div');
    snowContainer.style.position = 'absolute';
    snowContainer.style.top = '0';
    snowContainer.style.left = '0';
    snowContainer.style.right = '0';
    snowContainer.style.bottom = '0';
    snowContainer.style.pointerEvents = 'none';
    document.body.appendChild(snowContainer);
    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '<i class="fas fa-snowflake" style="color: #ADD8E6; font-size: 2rem;"></i>';
        snowflake.style.position = 'absolute';
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.top = `${Math.random() * 100}vh`;
        snowflake.style.fontSize = `${Math.random() * 2 + 1}rem`;
        snowflake.style.opacity = Math.random();
        snowContainer.appendChild(snowflake);
        snowflakes.push(snowflake);
    }
    function moveSnowflakes() {
        snowflakes.forEach((snowflake) => {
            let y = parseFloat(snowflake.style.top);
            let speed = Math.random() * 0.5 + 0.5;
            snowflake.style.top = `${y + speed}px`;
            if (y > window.innerHeight) {
                snowflake.style.top = '0';
                snowflake.style.left = `${Math.random() * 100}vw`;
            }
        });
        requestAnimationFrame(moveSnowflakes);
    }
    moveSnowflakes();
}

function stopSnowflakes() {
    const snowContainer = document.querySelector('div[style*="position: absolute"]');
    if (snowContainer)
        snowContainer.remove();
}