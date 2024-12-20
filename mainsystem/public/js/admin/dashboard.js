const Utils = {
    toggleContentVisibility: (id, show, transitionDuration = 1000) => {
        const element = document.getElementById(id);
        if (!element) return;

        element.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
        if (show) {
            element.classList.remove('hidden');
            element.style.opacity = 1;
        } else {
            element.style.opacity = 0;
            setTimeout(() => element.classList.add('hidden'), transitionDuration);
        }
    },

    setLoading: (element, isLoading, options = {}) => {
        const { spinnerId = 'loadingSpinner', spinnerSize = '8', spinnerColor = 'blue-500' } = options;
        if (!element) return;

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
    }
};

class ChartManager {
    constructor() {
        this.charts = {};
    }

    createChart(chartId, type, data, options) {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        const ctx = chartElement.getContext('2d');
        if (this.charts[chartId]) this.charts[chartId].destroy();

        this.charts[chartId] = new Chart(ctx, {
            type,
            data,
            options
        });
    }

    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }
}

const chartManager = new ChartManager();

class ContentManager {
    constructor(contentIds) {
        this.contentIds = contentIds;
        this.currentContent = 0;
    }

    cycleContent() {
        const currentId = this.contentIds[this.currentContent];
        const nextId = this.contentIds[(this.currentContent + 1) % this.contentIds.length];
        Utils.toggleContentVisibility(currentId, false);
        setTimeout(() => Utils.toggleContentVisibility(nextId, true), 1000);
        this.currentContent = (this.currentContent + 1) % this.contentIds.length;
    }

    startCycle(interval = 4000) {
        Utils.toggleContentVisibility(this.contentIds[this.currentContent], true);
        setInterval(() => this.cycleContent(), interval);
    }
}

const OverviewSections = {
    createUserOverviewSection: (data) => {
        const userOverviewContainer = document.getElementById('userOverviewContainer');
        if (!userOverviewContainer) return;

        userOverviewContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Users Overview</h2>
                <canvas id="userGenderPieChart" width="500" height="200"></canvas>
            </div>
        `;

        chartManager.createChart('userGenderPieChart', 'pie', {
            labels: data.gender.map(item => item.value),
            datasets: [{
                data: data.gender.map(item => item.count),
                backgroundColor: [
                    'rgba(243, 210, 195, 0.7)',
                    'rgba(93, 165, 255, 0.7)',
                    'rgba(255, 123, 129, 0.7)',
                    'rgba(255, 214, 92, 0.7)',
                    'rgba(100, 185, 108, 0.7)'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        }, {
            responsive: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => `Value: ${data.gender[tooltipItem.dataIndex].count}`
                    }
                }
            }
        });
    },

    createProductOverviewSection: (data) => {
        const productOverviewContainer = document.getElementById('productOverviewContainer');
        if (!productOverviewContainer) return;

        productOverviewContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Products Overview</h2>
                <div class="flex justify-between mb-4">
                    <p class="text-lg text-gray-700">Total Categories</p>
                    <p id="total-categories" class="text-lg font-semibold text-gray-800">${data.categories.length}</p>
                </div>
                <div id="categories-list" class="flex flex-wrap gap-x-1 gap-y-2"></div>
                <canvas id="categoriesChart" width="500" height="200"></canvas>
            </div>
        `;

        const categoriesList = document.getElementById('categories-list');
        data.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full border-2 border-blue-500 hover:bg-blue-200 transition duration-300 ease-in-out';
            categoryDiv.textContent = category.value;
            categoriesList.appendChild(categoryDiv);
        });

        chartManager.createChart('categoriesChart', 'bar', {
            labels: data.categories.map(item => item.value),
            datasets: [{
                label: 'Product Count',
                data: data.categories.map(item => item.count),
                backgroundColor: 'rgba(243, 210, 195, 0.5)',
                borderColor: '#fff',
                borderWidth: 1
            }]
        }, {
            responsive: false,
            scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Categories' } },
                y: { beginAtZero: true, title: { display: true, text: 'Counts' } }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager(['content1', 'content2', 'content3', 'content4', 'content5']);
    contentManager.startCycle();

    document.getElementById('userOverview').addEventListener('click', async () => {
        const userOverviewContainer = document.getElementById('userOverviewContainer');
        if (!userOverviewContainer) return;

        userOverviewContainer.innerHTML = '';
        userOverviewContainer.classList.toggle('hidden');
        Utils.setLoading(userOverviewContainer, true);

        try {
            const response = await fetch('/admin/api/user-overview');
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const data = await response.json();
            OverviewSections.createUserOverviewSection(data);
        } catch (error) {
            console.error('Error fetching user overview data:', error);
        } finally {
            Utils.setLoading(userOverviewContainer, false);
        }
    });

    document.getElementById('productOverview').addEventListener('click', async () => {
        const productOverviewContainer = document.getElementById('productOverviewContainer');
        if (!productOverviewContainer) return;

        productOverviewContainer.innerHTML = '';
        productOverviewContainer.classList.toggle('hidden');
        Utils.setLoading(productOverviewContainer, true);

        try {
            const response = await fetch('/admin/api/product-overview');
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const data = await response.json();
            console.log(data)
            OverviewSections.createProductOverviewSection(data);
        } catch (error) {
            console.error('Error fetching product overview data:', error);
        } finally {
            Utils.setLoading(productOverviewContainer, false);
        }
    });
});
