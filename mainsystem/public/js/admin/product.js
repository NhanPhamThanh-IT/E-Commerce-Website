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
                productCard.className = 'bg-white rounded-lg shadow-md p-4';
                productCard.innerHTML = `
                    <h3 class="font-bold text-lg mb-2">${product.title}</h3>
                    <p class="text-gray-600 mb-2">Category: ${product.category}</p>
                    <p class="text-gray-600 mb-2">Price: $${product.price}</p>
                    <p class="text-gray-600 mb-2">Stock: ${product.stock_quantity}</p>
                    <div class="flex justify-end space-x-2">
                        <button onclick="openViewModal('${product._id}')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View</button>
                        <button onclick="openDeleteModal('${product._id}')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Delete</button>
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

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition';
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchAndRenderProducts(`${url}?page=${currentPage - 1}`);
        paginationContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-4 py-2 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white hover:bg-gray-600 transition'}`;
        pageButton.textContent = i;
        if (i !== currentPage) {
            pageButton.onclick = () => fetchAndRenderProducts(`${url}?page=${i}`);
        }
        paginationContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition';
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchAndRenderProducts(`${url}?page=${currentPage + 1}`);
        paginationContainer.appendChild(nextButton);
    }
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
