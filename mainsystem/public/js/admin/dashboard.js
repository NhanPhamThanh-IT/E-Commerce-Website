document.addEventListener('DOMContentLoaded', () => {
    let currentContent = 0;
    const contentIds = ['content1', 'content2', 'content3', 'content4', 'content5'];
    let currentChart = null;

    const toggleContentVisibility = (id, show) => {
        const element = document.getElementById(id);
        if (!element) return;

        element.style.transition = 'opacity 1s ease-in-out';
        if (show) {
            element.classList.remove('hidden');
            element.style.opacity = 1;
        } else {
            element.style.opacity = 0;
            setTimeout(() => element.classList.add('hidden'), 1000);
        }
    };

    const cycleContent = () => {
        const currentId = contentIds[currentContent];
        const nextId = contentIds[(currentContent + 1) % contentIds.length];
        toggleContentVisibility(currentId, false);
        setTimeout(() => toggleContentVisibility(nextId, true), 1000);
        currentContent = (currentContent + 1) % contentIds.length;
    };

    const setLoading = (element, isLoading, options = {}) => {
        if (!element) return;

        const { spinnerId = 'loadingSpinner', spinnerSize = '8', spinnerColor = 'blue-500' } = options;
        let loadingElement = document.getElementById(spinnerId);

        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = spinnerId;
            loadingElement.className = 'flex justify-center items-center py-4';
            loadingElement.innerHTML = `
                <div class="animate-spin rounded-full h-${spinnerSize} w-${spinnerSize} border-t-2 border-${spinnerColor}"></div>`;
            element.appendChild(loadingElement);
        }

        loadingElement.style.display = isLoading ? 'flex' : 'none';
        element.style.opacity = isLoading ? '0.5' : '1';
    };

    const createUserOverviewSection = (data) => {
        const userOverviewContainer = document.getElementById('userOverviewContainer');
        if (!userOverviewContainer) return;

        const totalUsersElement = document.createElement('div');
        totalUsersElement.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Users Overview</h2>
            </div>
        `;
        userOverviewContainer.appendChild(totalUsersElement);
    };

    const createProductOverviewSection = (data) => {
        const productOverviewContainer = document.getElementById('productOverviewContainer');
        if (!productOverviewContainer) return;

        const totalCategoriesElement = document.createElement('div');
        totalCategoriesElement.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Products Overview</h2>
                <div class="flex justify-between mb-4">
                    <p class="text-lg text-gray-700">Total Categories</p>
                    <p id="total-categories" class="text-lg font-semibold text-gray-800">${data.categories.length}</p>
                </div>
                <div class="flex flex-row space-x-10 justify-between mb-4">
                    <p class="text-lg text-gray-700">Categories</p>
                    <div id="categories-list" class="flex flex-wrap gap-x-1 gap-y-2 justify-end">
                        ${data.categories.map(category => `<span class="bg-gray-200 p-2 rounded">${category.name}</span>`).join('')}
                    </div>
                </div>
                <div class="flex justify-between">
                    <canvas id="categoriesChart" width="500" height="200"></canvas>
                </div>
            </div>
        `;
        productOverviewContainer.appendChild(totalCategoriesElement);
        updateCategoriesList(data.categories);
        updateChart(data.categories);
    };

    const updateCategoriesList = (categories) => {
        const categoriesList = document.getElementById('categories-list');
        if (!categoriesList) return;

        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full border-2 border-blue-500 hover:bg-blue-200 transition duration-300 ease-in-out';
            categoryDiv.textContent = category.value;
            categoriesList.appendChild(categoryDiv);
        });
    };

    const updateChart = (categories) => {
        const chartElement = document.getElementById('categoriesChart');
        if (!chartElement) return;

        const ctx = chartElement.getContext('2d');

        if (currentChart) currentChart.destroy();

        const labels = categories.map(item => item.value);
        const counts = categories.map(item => item.count);

        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Product Count',
                    data: counts,
                    backgroundColor: ['rgba(243, 210, 195, 0.5)'],
                    borderColor: '#fff',
                    borderWidth: 1,
                }],
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => `Count: ${counts[tooltipItem.dataIndex]}`,
                        },
                    },
                },
                scales: {
                    x: { beginAtZero: true, title: { display: true, text: 'Categories' } },
                    y: { beginAtZero: true, title: { display: true, text: 'Counts' } },
                },
            },
        });
    };

    document.getElementById('userOverview').addEventListener('click', async () => {
        const userOverviewContainer = document.getElementById('userOverviewContainer');
        if (!userOverviewContainer) return;
        userOverviewContainer.innerHTML = '';

        userOverviewContainer.classList.toggle('hidden');
        setLoading(userOverviewContainer, true);

        try {
            const response = await fetch('/admin/api/user-overview');
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const data = await response.json();
            console.log(data);
            if (!data.users) throw new Error('Users data is missing or invalid.');

            createUserOverviewSection(data);
        } catch (error) {
            console.error('Error fetching user overview data:', error);
        } finally {
            setLoading(userOverviewContainer, false);
        }
    });

    document.getElementById('productOverview').addEventListener('click', async () => {
        const productOverviewContainer = document.getElementById('productOverviewContainer');
        if (!productOverviewContainer) return;
        productOverviewContainer.innerHTML = '';
        
        productOverviewContainer.classList.toggle('hidden');
        setLoading(productOverviewContainer, true);

        try {
            const response = await fetch('/admin/api/product-overview');
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const data = await response.json();
            if (!data.categories) throw new Error('Categories data is missing or invalid.');

            createProductOverviewSection(data);

        } catch (error) {
            console.error('Error fetching product overview data:', error);
        } finally {
            setLoading(productOverviewContainer, false);
        }
    });

    toggleContentVisibility(contentIds[currentContent], true);
    setInterval(cycleContent, 4000);
});
