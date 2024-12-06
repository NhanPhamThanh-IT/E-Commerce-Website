const fakeData = [
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e1",
        "name": "Áo thun nam",
        "description": "Áo thun cotton mềm mại, thoáng mát, dễ dàng phối đồ.",
        "price": 150000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d6",
            "name": "Thời trang",
            "created_at": "2024-12-06T10:10:00.000Z"
        },
        "stock_quantity": 100,
        "images": [
            "https://example.com/images/ao-thun-nam.jpg"
        ],
        "created_at": "2024-12-06T11:00:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e2",
        "name": "Laptop Dell XPS 13",
        "description": "Laptop Dell XPS 13, cấu hình mạnh mẽ, màn hình 4K, thiết kế siêu mỏng.",
        "price": 20000000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d5",
            "name": "Điện tử",
            "created_at": "2024-12-06T10:00:00.000Z"
        },
        "stock_quantity": 50,
        "images": [
            "https://example.com/images/laptop-dell-xps.jpg"
        ],
        "created_at": "2024-12-06T11:10:00.000Z"
    },
]

module.exports = fakeData;
