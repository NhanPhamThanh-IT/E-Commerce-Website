async function fetchAndRenderProducts(url) {
    const productsContainer = document.getElementById('products-container');
    const paginationContainer = document.getElementById('pagination-container');
    productsContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center my-3">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        <p class="mt-4 text-gray-600 text-base font-semibold">Loading...</p>
    </div>
    `;
    paginationContainer.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.products && data.products.length > 0) {
            productsContainer.innerHTML = '';
            productsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6'
            data.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'relative bg-white rounded-xl shadow-md px-4 pt-4 pb-3 border-2 border-slate-500 hover:scale-105 transition-transform cursor-pointer';
                productCard.innerHTML = `
                    <div class="flex flex-col justify-between h-full">
                        <div>
                            <img src="${product.image}" alt="${product.image}" class="w-full h-48 object-contain mb-2 rounded-lg">
                            <h3 class="font-bold text-lg mb-2 text-slate-500 truncate">
                                ${product.title}
                            </h3>
                        </div>
                        <div>
                            <p class="text-gray-600 mb-2">
                            <i class="fas fa-tags"></i>
                                ${product.category}
                            </p>
                            <div class="flex justify-between">
                                <p class="text-gray-600 text-base">
                                    💸
                                    ${product.price} USD
                                </p>
                                <p class="text-gray-600 text-base">Stock: ${product.stock_quantity}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="absolute top-3 right-5 flex flex-col items-center space-y-2">
                        <button onclick="openViewModal('${product._id}')"
                            class="view-button bg-blue-500 text-white w-8 py-2 rounded-lg hover:bg-blue-600 transition duration-400 font-bold">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="openDeleteModal('${product._id}')"
                            class="delete-button bg-red-500 text-white w-8 py-2 rounded-lg hover:bg-red-600 transition duration-400 font-bold">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                productsContainer.appendChild(productCard);
            });

            renderPagination(data.totalPages, data.currentPage, url);
        } else {
            productsContainer.innerHTML = '<p class="text-center text-gray-600">No products found.</p>';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        productsContainer.innerHTML = '<p class="text-center text-red-500">Failed to load products. Please try again.</p>';
    }
}

function renderPagination(totalPages, currentPage, url) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    paginationContainer.className = 'flex justify-between items-center my-4';

    const prevButton = document.createElement('button');
    prevButton.className = `w-24 bg-neutral-500 text-white font-bold py-2 rounded mx-1 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    if (currentPage > 1) {
        prevButton.addEventListener('mouseenter', () => {
            prevButton.style.cursor = 'pointer';
            prevButton.className = 'w-24 bg-black text-[#f3d2c3] font-bold py-2 rounded mx-1 transition-all duration-400 ease-in-out';

            prevButton.innerHTML = `<div style="
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 100%;
            ">
                <span style="
                    display: inline-block;
                    white-space: nowrap;
                    animation: marquee 2s linear infinite;
                ">
                    <i class="fas fa-chevron-left fa-solid"></i>
                    <i class="fas fa-chevron-left fa-solid"></i>
                    <i class="fas fa-chevron-left fa-solid"></i>
                    <i class="fas fa-chevron-left fa-solid"></i>
                    <i class="fas fa-chevron-left fa-solid"></i>
                </span>
            </div>`;

            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes marquee {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `;
            document.head.appendChild(style);
        });
    }

    prevButton.addEventListener('mouseleave', () => {
        prevButton.innerHTML = 'Previous';
        prevButton.className = `w-24 bg-neutral-500 text-white font-bold py-2 rounded mx-1 transition-all duration-400 ease-in-out ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            const baseUrl = url.split('?')[0];
            const queryParams = new URLSearchParams(url.split('?')[1]);
            queryParams.set('page', currentPage - 1);
            fetchAndRenderProducts(`${baseUrl}?${queryParams.toString()}`);
        }
    });
    paginationContainer.appendChild(prevButton);

    const pageDropdown = document.createElement('select');
    pageDropdown.className = 'bg-neutral-500 text-white font-bold py-2 px-4 rounded mx-1 appearance-none text-center';
    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentPage) {
            option.selected = true;
        }
        pageDropdown.appendChild(option);
    }

    pageDropdown.addEventListener('change', (e) => {
        const selectedPage = parseInt(e.target.value);
        const baseUrl = url.split('?')[0];
        const queryParams = new URLSearchParams(url.split('?')[1]);
        queryParams.set('page', selectedPage);
        fetchAndRenderProducts(`${baseUrl}?${queryParams.toString()}`);
    });
    paginationContainer.appendChild(pageDropdown);

    const nextButton = document.createElement('button');
    nextButton.className = `w-24 bg-neutral-500 text-white font-bold py-2 rounded mx-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;

    if (currentPage < totalPages) {
        nextButton.addEventListener('mouseenter', () => {
            nextButton.style.cursor = 'pointer';
            nextButton.className = 'w-24 bg-black text-[#f3d2c3] font-bold py-2 rounded mx-1 transition-all duration-400 ease-in-out';
            nextButton.innerHTML = `<div style="
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 100%;
            ">
                <span style="
                    display: inline-block;
                    white-space: nowrap;
                    animation: marquee 2s linear infinite;
                ">
                    <i class="fas fa-chevron-right fa-solid"></i>
                    <i class="fas fa-chevron-right fa-solid"></i>
                    <i class="fas fa-chevron-right fa-solid"></i>
                    <i class="fas fa-chevron-right fa-solid"></i>
                    <i class="fas fa-chevron-right fa-solid"></i>
                </span>
            </div>`;

            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes marquee {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        });
    }

    nextButton.addEventListener('mouseleave', () => {
        nextButton.innerHTML = 'Next';
        nextButton.className = `w-24 bg-neutral-500 text-white font-bold py-2 rounded mx-1 transition-all duration-400 ease-in-out ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
    });
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            const baseUrl = url.split('?')[0];
            const queryParams = new URLSearchParams(url.split('?')[1]);
            queryParams.set('page', currentPage + 1);
            fetchAndRenderProducts(`${baseUrl}?${queryParams.toString()}`);
        }
    });
    paginationContainer.appendChild(nextButton);
}

async function openViewModal(productId) {
    const modal = document.getElementById('viewModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    try {
        const response = await fetch(`/admin/products/info/${productId}`);
        const product = await response.json();

        document.getElementById('view-title').textContent = product.title || 'N/A';
        document.getElementById('view-category').textContent = product.category || 'N/A';
        document.getElementById('view-desc').textContent = product.description || 'N/A';
        document.getElementById('view-price').textContent = `${product.price || 0}`;
        document.getElementById('view-discount').textContent = `${product.discount || 0}`;
        document.getElementById('view-stock').textContent = product.stock_quantity || 0;

        document.getElementById('review-container').innerHTML = '';
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'bg-white border-2 border-slate-500 rounded-xl shadow-md px-4 pt-3 mb-4 h-24';
                reviewCard.innerHTML = `
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-lg text-slate-500">${review.reviewerName}</h3>
                        <p class="text-gray-600">${review.rating} ⭐</p>
                    </div>
                    <p class="text-gray-600 mt-2 w-full truncate">${review.comment}</p>
                `;
                document.getElementById('review-container').appendChild(reviewCard);
            });
        }

        document.getElementById('editButton').innerHTML = '';
        document.getElementById('editButton').innerHTML = `
            <button type="button" onclick="handleEdit('${product._id}')"
                class="p-2 bg-teal-400 text-white rounded-lg hover:bg-teal-600 transition">
                <i class="fas fa-pencil-alt"></i>
            </button>
        `;

    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details. Please try again.');
        closeViewModal();
    }
}

function closeViewModal() {
    const viewModal = document.getElementById('viewModal');
    const reviewModal = document.getElementById('reviewModal');
    viewModal.classList.add('hidden');
    viewModal.classList.remove('flex');
    reviewModal.classList.add('hidden');
    const reviewButton = document.getElementById('reviewButton');
    reviewButton.innerHTML = 'View <i class="fas fa-comment"></i>';
    reviewButton.onclick = () => openReviewModal();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderProducts('/admin/products/api?page=1');
});

// Open review modal

function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('hidden');
    const reviewButton = document.getElementById('reviewButton');
    reviewButton.innerHTML = 'Close <i class="fas fa-comment"></i>';
    reviewButton.onclick = () => closeReviewModal();
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.add('hidden');
    const reviewButton = document.getElementById('reviewButton');
    reviewButton.innerHTML = 'View <i class="fas fa-comment"></i>';
    reviewButton.onclick = () => openReviewModal();
}

// Open add modal
async function openAddProductModal() {
    try {
        const form = document.getElementById('addProductForm');
        form.reset();
        const response = await fetch('/admin/products/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const list_categories = await response.json();
        const categoryDropdown = document.getElementById('categoryDropdown');
        if (categoryDropdown) {
            categoryDropdown.innerHTML = '';
            list_categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error opening add product modal:', error);
        alert('Failed to open add product modal. Please try again.');
    }

    const modal = document.getElementById('addProductModal');
    modal.classList.remove('hidden');
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('hidden');
}

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const field = document.querySelector('select[name="field"]').value;
    const query = document.querySelector('input[name="query"]').value.trim();

    if (!field || !query) {
        alert('Please select a field and enter a value to search.');
        return;
    }

    const action = this.getAttribute('action');

    const page = new URLSearchParams(window.location.search).get('page') || 1;

    const url = `${action}?field=${field}&query=${encodeURIComponent(query)}&page=${page}`;
    fetchAndRenderProducts(url);
});

function openDeleteModal(productId) {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.onclick = () => handleDeleteProduct(productId);
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function handleDeleteProduct(productId) {
    closeDeleteModal();
    try {
        const response = await fetch(`/admin/products/delete/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });
        if (response.ok) {
            alert('Product deleted successfully');
            fetchAndRenderProducts('/admin/products/api?page=1');
        } else {
            alert('Failed to delete the product. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred. Please try again.');
    }
}

document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    try {
        const response = await fetch("/admin/products/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
        if (response.ok) {
            const result = await response.json();
            alert("Product added successfully!");
            console.log(result);
            closeAddProductModal();
        } else {
            alert("Failed to add product.");
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
    }
});

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
}

async function handleEdit(productId) {
    const modal = document.getElementById('editProductModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    closeViewModal();

    try {
        const response = await fetch(`/admin/products/info/${productId}`);
        const product = await response.json();

        document.getElementById('edit_title').value = product.title || '';
        document.getElementById('edit_category').value = product.category || '';
        document.getElementById('edit_price').value = product.price || 0;
        document.getElementById('edit_stock_quantity').value = product.stock_quantity || 0;
        document.getElementById('edit_brand').value = product.brand || '';
        document.getElementById('edit_model').value = product.model || '';
        document.getElementById('edit_color').value = product.color || '';
        document.getElementById('edit_discount').value = product.discount || 0;
        document.getElementById('edit_description').value = product.description || '';
        document.getElementById('edit_image').value = product.image || '';

        const form = document.getElementById('editProductForm');
        form.action = `/admin/products/edit/${productId}`;

    } catch (error) {
        console.error('Error fetching product data for editing:', error);
        alert('Failed to load product details. Please try again.');
        closeEditProductModal();
    }
}

document.getElementById("editProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    try {
        const response = await fetch(this.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
        if (response.ok) {
            const result = await response.json();
            alert("Product updated successfully!");
            console.log(result);
            closeEditProductModal();
        } else {
            alert("Failed to update product.");
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
    }
});

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Open manage categories modal
async function openManageCategoriesModal() {
    try {
        const response = await fetch('/admin/products/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const categories = await response.json();
        const categoriesContainer = document.getElementById('manageCategoriesModal');
        categoriesContainer.classList.remove('hidden');
        categoriesContainer.className = "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out";
        categoriesContainer.innerHTML = '';
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white w-full md:w-4/5 lg:w-2/3 xl:w-1/2 rounded-xl shadow-lg overflow-hidden flex flex-row';
        const categoriesSection = document.createElement('div');
        categoriesSection.className = 'basis-3/4 p-4 overflow-y-auto';
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

        categories.forEach(category => {
            const categoryWrapper = document.createElement('div');
            categoryWrapper.className = 'flex items-center space-x-2';

            const categoryCard = document.createElement('span');
            categoryCard.className = 'rounded-2xl bg-blue-100 text-blue-600 px-2 py-4 text-xs w-32 h-16 font-small flex items-center justify-center';
            categoryCard.textContent = category.name;

            // const deleteButton = document.createElement('button'); 
            // deleteButton.className = 'bg-red-500 text-white text-xs font-medium px-2 py-1 rounded hover:bg-red-600';
            // deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
            // deleteButton.onclick = () => handleDeleteCategory(category._id); 

            categoryWrapper.appendChild(categoryCard);
            gridContainer.appendChild(categoryWrapper);
        });

        categoriesSection.appendChild(gridContainer);

        const statsSection = document.createElement('div');
        statsSection.className = 'basis-1/4 p-4 bg-gray-50 border-t-2 md:border-l-2 md:border-t-0 border-gray-200 flex flex-col justify-between space-y-4';
        statsSection.innerHTML = `
            <h4 class="text-xl font-semibold mb-2 ">Category Statistics</h4>
            <p class="text-sm text-gray-700">View category statistics such as total products, active products, etc.</p>
            <div id="statsSection"></div>
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-between items-center space-x-4'; // Dùng flex để đặt nút trên 1 dòng và thêm khoảng cách

        const closeButton = document.createElement('button');
        closeButton.className = 'bg-gray-500 text-white  py-2 px-4 rounded-lg hover:bg-gray-600 transform transition-all duration-200 ease-in-out';
        closeButton.textContent = 'Close';
        closeButton.onclick = () => categoriesContainer.classList.add('hidden');
        buttonContainer.appendChild(closeButton);

        const addCategoryButton = document.createElement('button');
        addCategoryButton.className = 'w-40 bg-blue-500 text-white  py-2 px-4  rounded-lg hover:bg-blue-600 transform transition-all duration-200 ease-in-out';
        addCategoryButton.textContent = 'Add Category';
        addCategoryButton.onclick = () => openAddCategoryModal();
        buttonContainer.appendChild(addCategoryButton);

        statsSection.appendChild(buttonContainer);

        modalContent.appendChild(categoriesSection);
        modalContent.appendChild(statsSection);
        categoriesContainer.appendChild(modalContent);


    } catch (error) {
        console.error('Error opening manage categories modal:', error);
        alert('Failed to open manage categories modal. Please try again.');
    }
};

function closeManageCategoriesModal() {
    const modal = document.getElementById('manageCategoriesModal');
    modal.classList.add('hidden');
}

function openAddCategoryModal() {
    const addCategoryModal = document.getElementById('addCategoryModal');
    const manageCategoriesModal = document.getElementById('manageCategoriesModal');
    addCategoryModal.classList.remove('hidden');
    manageCategoriesModal.classList.add('hidden');

    // Đảm bảo modal không bị ghi đè lớp CSS
    addCategoryModal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out';

    // Xóa nội dung cũ trước khi thêm mới
    addCategoryModal.innerHTML = '';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white w-full md:w-4/5 lg:w-2/3 xl:w-1/2 rounded-xl shadow-lg overflow-hidden flex flex-col';

    // Thêm nút đóng modal
    const closeButton = document.createElement('button');
    closeButton.className = 'self-end m-2 text-gray-500 hover:text-red-500';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeAddCategoryModal;

    const form = document.createElement('form');
    form.id = 'addCategoryForm';
    form.className = 'w-full p-4';
    form.innerHTML = `
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Add New Category</h2>
        <div class="mb-4">
            <label for="categoryName" class="block text-sm font-medium text-gray-700">Category Name</label>
            <input type="text" name="categoryName" id="categoryName" placeholder="Enter category name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required>
        </div>
        <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out">Add Category</button>
        </div>
    `;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(form);
    addCategoryModal.appendChild(modalContent);
}

function closeAddCategoryModal() {
    const addCategoryModal = document.getElementById('addCategoryModal');
    addCategoryModal.classList.add('hidden');
    addCategoryModal.innerHTML = ''; // Reset nội dung modal
}

document.addEventListener('submit', async function (e) {
    if (e.target && e.target.id === 'addCategoryForm') {
        e.preventDefault();
        const categoryName = document.getElementById('categoryName').value.trim();

        if (!categoryName) {
            alert('Please enter a category name.');
            return;
        }

        try {
            const response = await fetch('/admin/products/category/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryName }),
            });

            if (response.ok) {
                alert('Category added successfully');
                closeAddCategoryModal();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to add category. Please try again.');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert('An error occurred. Please try again.');
        }
    }
});

function closeAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    modal.classList.add('hidden');
};