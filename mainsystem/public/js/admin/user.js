async function fetchAndRenderUsers(url) {
    const usersContainer = document.getElementById('users-container');
    const paginationContainer = document.getElementById('pagination-container');
    usersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-gray-600">Loading...</td></tr>';
    paginationContainer.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        usersContainer.innerHTML = '';
        if (response.ok && data.users && data.users.length > 0) {
            data.users.forEach(user => {
                const userRow = document.createElement('tr');
                userRow.innerHTML = `
                    <td class="px-4 py-3 text-center">
                        <img src="${user.image}" alt="User Image" class="w-16 h-16 rounded-full mx-auto">
                    </td>
                    <td class="px-4 py-3 text-center">${user.username}</td>
                    <td class="px-4 py-3 text-center">${user.email}</td>
                    <td class="px-4 py-3">
                        <div class="flex justify-center items-center space-x-2">
                            <form class="my-0 mb-0">
                                <input type="hidden" name="_id" value="${user._id}" class="mx-auto"/>
                                <button type="button" onclick="openViewModal('${user._id}')" class="view-button bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-800 font-bold mx-auto">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </form>
                            <form class="my-0 mb-0">
                                <input type="hidden" name="_id" value="${user._id}" class="mx-auto"/>
                                <button type="button" onclick="openDeleteModal('${user._id}')" class="delete-button bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-800 font-bold mx-auto">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                `;
                usersContainer.appendChild(userRow);
            });
            renderPagination(data.totalPages, data.currentPage, url);
        } else {
            usersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-gray-600">No users found.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        usersContainer.innerHTML = '<tr><td colspan="4" class="text-center text-red-500">Failed to load users. Please try again.</td></tr>';
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
        fetchAndRenderUsers(`${baseUrl}?${queryParams.toString()}`);
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
            fetchAndRenderUsers(`${baseUrl}?${queryParams.toString()}`);
        }
    });
    paginationContainer.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderUsers('/admin/users/api?page=1');
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
    
    fetchAndRenderUsers(url);
});