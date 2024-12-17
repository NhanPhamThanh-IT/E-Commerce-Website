async function fetchAndRenderProducts(url) {
    const productsContainer = document.getElementById('products-container');
    const paginationContainer = document.getElementById('pagination-container');
    productsContainer.innerHTML = '<p class="text-center text-gray-600">Loading...</p>';
    paginationContainer.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.products && data.products.length > 0) {
            productsContainer.innerHTML = '';
            data.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'relative bg-white rounded-xl shadow-md px-4 pt-4 pb-3 border-2 border-slate-500 hover:scale-105 transition-transform cursor-pointer';
                productCard.innerHTML = `
                    <div class="flex flex-col justify-between h-full">
                        <div>
                            <img src="${product.image}" alt="${product.image}" class="w-full h-48 object-contain mb-2 rounded-lg">
                            <h3 class="font-bold text-lg mb-2 text-slate-500">${product.title}</h3>
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
                            class="view-button bg-blue-500 text-white w-8 py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-bold">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="openDeleteModal('${product._id}')"
                            class="delete-button bg-red-500 text-white w-8 py-2 rounded-lg hover:bg-red-600 transition duration-300 font-bold">
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
    prevButton.className = `bg-neutral-500 hover:bg-black text-white font-bold py-2 px-4 rounded mx-1 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
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
    nextButton.className = `bg-neutral-500 hover:bg-black text-white font-bold py-2 px-10 rounded mx-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
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
        document.getElementById('view-price').textContent = `$${product.price || 0}`;
        document.getElementById('view-stock').textContent = product.stock_quantity || 0;
    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details. Please try again.');
        closeViewModal();
    }
}

function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

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
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Product deleted successfully');
            fetchAndRenderProducts('/admin/products/api?page=1');
        } else {
            alert('Failed to delete product.');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderProducts('/admin/products/api?page=1');
});
