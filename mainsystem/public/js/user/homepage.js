const list_banner = [];
for (let i = 1; i <= 6; i++) {
    list_banner.push(`/system_images/banner_${i}.png`);
}

document.addEventListener("DOMContentLoaded", function () {
    const imgContainer = document.getElementById('image_container');
    const modal = document.getElementById('banner_modal');
    if (imgContainer) {
        document.body.style.overflow = 'hidden';
        const randomBanner = list_banner[Math.floor(Math.random() * list_banner.length)];
        imgContainer.innerHTML = `
            <img src="${randomBanner}" alt="sale_banner" class="w-7/8 rounded-2xl">
        `;
        imgContainer.addEventListener('click', function (event) {
            if (event.target === imgContainer || event.target.closest('#image_container')) {
                if (modal) {
                    modal.classList.add('hidden');
                }
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error("Element 'image_container' not found.");
    }
});
