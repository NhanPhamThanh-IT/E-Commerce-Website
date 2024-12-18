document.addEventListener('DOMContentLoaded', () => {
    let currentContent = 0;
    const contentIds = ['content1', 'content2', 'content3', 'content4', 'content5'];

    const toggleContentVisibility = (id, show) => {
        const element = document.getElementById(id);
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

    toggleContentVisibility(contentIds[currentContent], true);
    setInterval(cycleContent, 4000);

    const parseValue = (value) => parseInt(value) || 0;
    const users = parseValue('{{users}}');
    const products = parseValue('{{products}}');
    const orders = parseValue('{{orders}}');

    const createBarChart = (ctx, data, options, plugins = []) => {
        return new Chart(ctx, { type: 'bar', data, options, plugins });
    };

    // Dashboard Chart
    createBarChart(
        document.getElementById('dashboardChart').getContext('2d'),
        {
            labels: ['Users', 'Products', 'Orders'],
            datasets: [{
                label: 'Count',
                data: [users, products, orders],
                backgroundColor: ['#3b82f6', '#10B981', '#F59E0B'],
                borderColor: ['#4F46E5', '#059669', '#D97706'],
                borderWidth: 1
            }]
        },
        {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    );

    // Categories Chart
    const categories = JSON.parse('{{{categories}}}');
    const labels = categories.map(item => item.value);
    const counts = categories.map(item => item.count);

    createBarChart(
        document.getElementById('categoriesChart').getContext('2d'),
        {
            labels,
            datasets: [{
                label: 'Product Count',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 71, 0.5)', 'rgba(144, 238, 144, 0.5)',
                    'rgba(255, 165, 0, 0.5)', 'rgba(0, 128, 128, 0.5)'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => `Count: ${counts[tooltipItem.dataIndex]}`
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Categories' } },
                y: { beginAtZero: true, title: { display: true, text: 'Counts' } }
            }
        },
        [{
            id: 'drawCounts',
            afterDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                chart.getDatasetMeta(0).data.forEach((bar, index) => {
                    const value = chart.data.datasets[0].data[index];
                    const { x, y } = bar.tooltipPosition();
                    ctx.fillStyle = '#000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(value, x, y - 5);
                });
            }
        }]
    );
});
