async function fetchAndRenderOrders(url) {
    const ordersContainer = document.getElementById('orders-container');
    const paginationContainer = document.getElementById('pagination-container');
    ordersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-gray-600">Loading...</td></tr>';
    paginationContainer.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        ordersContainer.innerHTML = '';
        if (response.ok && data.orders && data.orders.length > 0) {
            data.orders.forEach(order => {
                const orderRow = document.createElement('tr');
                orderRow.innerHTML = `
                    <td class="px-4 py-3 text-center">${order.user_name}</td>
                    <td class="px-4 py-3 text-center">${order.date}</td>
                    <td class="px-4 py-3 text-center">${order.total_amount}</td>
                    <td class="px-4 py-3">
                        <div class="flex justify-center items-center space-x-2">
                            <form class="my-0 mb-0">
                                <input type="hidden" name="_id" value="${order._id}" class="mx-auto"/>
                                <button type="button" onclick="openViewModal('${order._id}')" class="view-button bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-800 font-bold mx-auto">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </form>
                            <form class="my-0 mb-0">
                                <input type="hidden" name="_id" value="${order._id}" class="mx-auto"/>
                                <button type="button" onclick="openDeleteModal('${order._id}')" class="delete-button bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-800 font-bold mx-auto">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                `;
                ordersContainer.appendChild(orderRow);
            });
            renderPagination(data.totalPages, data.currentPage, url);
        } else {
            ordersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-gray-600">No orders found.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-red-500">Failed to load orders. Please try again.</td></tr>';
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
            fetchAndRenderOrders(`${baseUrl}?${queryParams.toString()}`);
        }
    });
    paginationContainer.appendChild(prevButton);

    const pageDropdown = document.createElement('select');
    pageDropdown.className = 'bg-neutral-500 text-white font-bold py-2 px-4 rounded mx-1 appearance-none';
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
        fetchAndRenderOrders(`${baseUrl}?${queryParams.toString()}`);
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
            fetchAndRenderOrders(`${baseUrl}?${queryParams.toString()}`);
        }
    });
    paginationContainer.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderOrders('/admin/orders/api?page=1');
});

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
    fetchAndRenderOrders(url);
});

////////////////////////////////////////////
//      View and delete order modals      //
////////////////////////////////////////////

async function openViewModal(orderId) {
    const modal = document.getElementById('viewModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    try {
        const response = await fetch(`/admin/orders/info/${orderId}`);
        if (!response.ok)
            throw new Error('Failed to fetch order details');
        const orderData = await response.json();
        document.getElementById('view-user-id').textContent = orderData.user_id || 'N/A';
        document.getElementById('view-date').textContent = orderData.date || 'N/A';
        document.getElementById('view-total-amount').textContent = `$${orderData.total_amount || 0}`;
        const itemsList = document.getElementById('view-items');
        itemsList.innerHTML = '';
        if (orderData.list_of_items && orderData.list_of_items.length > 0) {
            orderData.list_of_items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'flex flex-col w-full flex-wrap';
                listItem.innerHTML = `
                    <p class="text-justify">${item.title}</p>
                    <p class="flex justify-end text-green-500">Quantity:  <span class="text-green-500 font-semibold"> ${item.quantity}
                    </span></p>
                `;
                itemsList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'No items found';
            itemsList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        alert('Failed to load order details. Please try again.');
        closeViewModal();
    }
}

function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function openDeleteModal(orderId) {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.onclick = () => handleDeleteOrder(orderId);
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function handleDeleteOrder(orderId) {
    closeDeleteModal();
    try {
        const response = await fetch(`/admin/orders/delete/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
        });
        if (response.ok) {
            alert('Order deleted successfully');
            fetchAndRenderOrders('/admin/orders/api?page=1');
        } else {
            alert('Failed to delete the order. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('An error occurred. Please try again.');
    }
}