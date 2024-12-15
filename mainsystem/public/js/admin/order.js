async function fetchAndRenderOrders(url) {
    const ordersContainer = document.getElementById('orders-container');
    const paginationContainer = document.getElementById('pagination-container');
    ordersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-gray-600">Loading...</td></tr>';
    paginationContainer.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        ordersContainer.innerHTML = '';

        if (response.ok && data.Orders && data.Orders.length > 0) {
            data.Orders.forEach(order => {
                const orderRow = document.createElement('tr');
                orderRow.innerHTML = `
                    <td class="px-4 py-2 border border-gray-300 text-center">${order.user_id}</td>
                    <td class="px-4 py-2 border border-gray-300 text-center">${order.date}</td>
                    <td class="px-4 py-2 border border-gray-300 text-center">${order.total_amount}</td>
                    <td class="px-4 py-2 border border-gray-300">
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
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `bg-neutral-500 hover:bg-black text-white font-bold py-2 px-4 rounded mx-1 ${i === currentPage ? 'opacity-50 cursor-not-allowed' : ''}`;
        button.textContent = i;
        button.disabled = i === currentPage;
        button.addEventListener('click', () => {
            const baseUrl = url.split('?')[0];
            const queryParams = new URLSearchParams(url.split('?')[1]);
            queryParams.set('page', i);
            fetchAndRenderOrders(`${baseUrl}?${queryParams.toString()}`);
        });
        paginationContainer.appendChild(button);
    }
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