// Initiate the cycle of content sections

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

document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager(['content1', 'content2', 'content3', 'content4', 'content5']);
    contentManager.startCycle();

    const displayPerformanceOverview = async () => {
        const performanceOverviewContainer = document.getElementById('performanceOverviewContainer');
    
        if (performanceOverviewContainer) {
            performanceOverviewContainer.innerHTML = '<p>Loading...</p>';
            
            try {
                const response = await fetch('/admin/api/performance-overview');
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                const labels = data.previousRevenue.map(item => `${item.month}/${item.year}`);
                const revenueData = data.previousRevenue.map(item => item.totalAmount);
                performanceOverviewContainer.innerHTML = `
                    <div class="bg-white p-6 border-black border-opacity-30 border-[1px] rounded-xl shadow-lg">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Performance Overview</h2>
                        <canvas id="performanceLineChart" height="300" width="900"></canvas>
                    </div>
                `;
                chartManager.createChart('performanceLineChart', 'line', {
                    labels: labels,
                    datasets: [{
                        label: 'Total Revenue',
                        data: revenueData,
                        fill: false,
                        borderColor: '#f9c74f',
                        tension: 0.1
                    }]
                }, {
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: { display: true, text: 'Month-Year' }
                        },
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Total Revenue' }
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching performance overview data:', error);
                performanceOverviewContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
            }
        } else {
            console.error('Performance overview container not found.');
        }
    };
    
    displayPerformanceOverview();    
});

// Topic overview section
const handleOverviewClick = async (buttonId, containerId, listOtherContainersId, apiEndpoint, renderSection) => {
    const button = document.getElementById(buttonId);
    const container = document.getElementById(containerId);
    if (!button || !container) return;

    const isVisible = !container.classList.contains('hidden');

    if (isVisible) {
        container.classList.add('hidden');
        return;
    }

    button.disabled = true;
    listOtherContainersId.forEach(id => {
        const otherContainer = document.getElementById(id);
        if (otherContainer) otherContainer.classList.add('hidden');
    });
    container.classList.remove('hidden');
    container.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        renderSection(data);
    } catch (error) {
        console.error(`Error fetching data for ${buttonId}:`, error);
        container.innerHTML = '<p>Error loading data. Please try again later.</p>';
    } finally {
        button.disabled = false;
    }
};

document.getElementById('userOverview').addEventListener('click', () => {
    handleOverviewClick('userOverview', 'userOverviewContainer', ['productOverviewContainer', 'orderOverviewContainer'], '/admin/api/user-overview', OverviewSections.createUserOverviewSection);
});

document.getElementById('productOverview').addEventListener('click', () => {
    handleOverviewClick('productOverview', 'productOverviewContainer', ['userOverviewContainer', 'orderOverviewContainer'], '/admin/api/product-overview', OverviewSections.createProductOverviewSection);
});

document.getElementById('orderOverview').addEventListener('click', () => {
    handleOverviewClick('orderOverview', 'orderOverviewContainer', ['userOverviewContainer', 'productOverviewContainer'], '/admin/api/order-overview', OverviewSections.createOrderOverviewSection);
});

class ChartManager {
    constructor() {
        this.charts = {};
    }

    createChart(chartId, type, data, options) {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        const ctx = chartElement.getContext('2d');
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }

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

const OverviewSections = {
    createUserOverviewSection: (data) => {
        const userOverviewContainer = document.getElementById('userOverviewContainer');
        if (!userOverviewContainer) return;

        userOverviewContainer.innerHTML = `
            <div class="bg-white p-6 border-black border-opacity-30 border-[1px] rounded-xl shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Users Overview</h2>
                <div class="flex justify-center mb-4 space-x-6">
                    <div class="w-1/3 flex justify-center">
                        <canvas id="userGenderPieChart" height="150"></canvas>
                    </div>
                    <div class="w-1/3 flex justify-center">
                        <canvas id="userLoginMethodPieChart" height="150"></canvas>
                    </div>
                    <div class="w-1/3 flex justify-center">
                        <canvas id="userAgePieChart" height="150"></canvas>
                    </div>
                </div>
            </div>
        `;

        chartManager.createChart('userGenderPieChart', 'doughnut', {
            labels: data.gender.map(item => item.value),
            datasets: [{
                data: data.gender.map(item => item.count),
                backgroundColor: [
                    '#ecb176',
                    '#d99a6c',
                    '#fed8b1'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        }, {
            responsive: true,
            cutout: '50%',
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const value = tooltipItem.raw;
                            return `${tooltipItem.label}: ${value}`;
                        }
                    }
                }
            }
        });

        chartManager.createChart('userLoginMethodPieChart', 'doughnut', {
            labels: data.loginMethod.map(item => item.value),
            datasets: [{
                data: data.loginMethod.map(item => item.count),
                backgroundColor: [
                    '#fb6f92',
                    '#ffb3c6'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        }, {
            responsive: true,
            cutout: '50%',
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const value = tooltipItem.raw;
                            return `${tooltipItem.label}: ${value}`;
                        }
                    }
                }
            }
        });

        chartManager.createChart('userAgePieChart', 'doughnut', {
            labels: data.age.map(item => item.value),
            datasets: [{
                data: data.age.map(item => item.count),
                backgroundColor: [
                    '#f94144',
                    '#f3722c',
                    '#f8961e',
                    '#f9c74f',
                    '#90be6d',
                    '#43aa8b',
                    '#577590'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        }, {
            responsive: true,
            cutout: '50%',
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const value = tooltipItem.raw;
                            return `${tooltipItem.label}: ${value}`;
                        }
                    }
                }
            }
        });
    },

    createProductOverviewSection: (data) => {
        const productOverviewContainer = document.getElementById('productOverviewContainer');
        if (!productOverviewContainer) return;

        productOverviewContainer.innerHTML = `
            <div class="bg-white p-6 rounded-xl border-black border-opacity-30 border-[1px] shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Products Overview</h2>
                <div class="flex justify-between mb-4">
                    <p class="text-base text-gray-500">Total Categories</p>
                    <p id="total-categories" class="text-lg font-semibold text-gray-800">${data.categories.length}</p>
                </div>
                <div class="flex justify-between mb-4">
                    <p class="text-base text-gray-500">Categories</p>
                    <div id="categories-list" class="flex flex-wrap gap-x-1 gap-y-2"></div>
                </div>
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
                label: 'Product Counts',
                data: data.categories.map(item => item.count),
                backgroundColor: [
                    '#ef476f',
                    '#f78c6b',
                    '#ffd166',
                    '#83d483',
                    '#06d6a0',
                    '#0cb0a9',
                    '#118ab2',
                    '#073b4c'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        }, {
            responsive: true,
            scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Categories' } },
                y: { beginAtZero: true, title: { display: true, text: 'Counts' } }
            }
        });
    },

    createOrderOverviewSection: (data) => {
        const orderOverviewContainer = document.getElementById('orderOverviewContainer');
        if (!orderOverviewContainer) return;

        orderOverviewContainer.innerHTML = `
            <div class="bg-white p-6 rounded-xl border-black border-opacity-30 border-[1px] shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Orders Overview</h2>

                <div class="flex justify-between mb-6">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-dollar-sign text-xl text-gray-500"></i>
                        <p class="text-base text-gray-500">Total Revenue</p>
                    </div>
                    <p id="total-revenue" class="text-lg font-semibold text-gray-800">${data.revenue}</p>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-6">
                    <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-calendar-day text-xl text-gray-500"></i>
                            <p class="text-base text-gray-500">Total Orders in This Day</p>
                        </div>
                        <p id="total-orders-day" class="text-lg font-semibold text-gray-800">${data.ordersOfDay}</p>
                    </div>
                    <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-calendar-day text-xl text-gray-500"></i>
                            <p class="text-base text-gray-500">Total Revenue in This Day</p>
                        </div>
                        <p id="total-revenue-day" class="text-lg font-semibold text-gray-800">${data.revenueOfDay}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-6">
                    <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-calendar-week text-xl text-gray-500"></i>
                            <p class="text-base text-gray-500">Total Revenue in This Week</p>
                        </div>
                        <p id="total-revenue-week" class="text-lg font-semibold text-gray-800">${data.revenueOfWeek}</p>
                    </div>
                    <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-calendar-week text-xl text-gray-500"></i>
                            <p class="text-base text-gray-500">Total Orders in This Week</p>
                        </div>
                        <p id="total-orders-week" class="text-lg font-semibold text-gray-800">${data.ordersOfWeek}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-6">
                    <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-calendar text-xl text-gray-500"></i>
                            <p class="text-base text-gray-500">Total Revenue in This Month</p>
                        </div>
                        <p id="total-revenue-month" class="text-lg font-semibold text-gray-800">${data.revenueOfMonth}</p>
                    </div>
                    <div class="flex items-center justify-between space-x-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-calendar text-xl text-gray-500"></i>
                            <p class="text-base text-gray-500">Total Orders in This Month</p>
                        </div>
                        <p id="total-orders-month" class="text-lg font-semibold text-gray-800">${data.ordersOfMonth}</p>
                    </div>
                </div>
            </div>
        `;
    }
};