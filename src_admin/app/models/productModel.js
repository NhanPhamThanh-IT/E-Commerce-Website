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
        "images": "https://example.com/images/ao-thun-nam.jpg",
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
        "images": "https://example.com/images/laptop-dell-xps.jpg",
        "created_at": "2024-12-06T11:10:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e3",
        "name": "Điện thoại iPhone 15",
        "description": "Điện thoại iPhone 15, camera 48MP, màn hình OLED, thiết kế hiện đại.",
        "price": 30000000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d7",
            "name": "Điện thoại",
            "created_at": "2024-12-06T09:50:00.000Z"
        },
        "stock_quantity": 30,
        "images": "https://example.com/images/iphone-15.jpg",
        "created_at": "2024-12-06T11:20:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e4",
        "name": "Tai nghe AirPods Pro 2",
        "description": "Tai nghe AirPods Pro 2, chống ồn, âm thanh chất lượng cao.",
        "price": 5000000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d8",
            "name": "Phụ kiện",
            "created_at": "2024-12-06T09:30:00.000Z"
        },
        "stock_quantity": 200,
        "images": "https://example.com/images/airpods-pro.jpg",
        "created_at": "2024-12-06T11:30:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e5",
        "name": "Máy tính bảng iPad Pro 12.9",
        "description": "Máy tính bảng iPad Pro 12.9, màn hình Liquid Retina, hiệu suất mạnh mẽ.",
        "price": 25000000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d5",
            "name": "Điện tử",
            "created_at": "2024-12-06T09:20:00.000Z"
        },
        "stock_quantity": 40,
        "images": "https://example.com/images/ipad-pro.jpg",
        "created_at": "2024-12-06T11:40:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e6",
        "name": "Áo sơ mi nam",
        "description": "Áo sơ mi nam cotton cao cấp, thoáng khí, thiết kế trẻ trung.",
        "price": 250000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d6",
            "name": "Thời trang",
            "created_at": "2024-12-06T09:10:00.000Z"
        },
        "stock_quantity": 150,
        "images": "https://example.com/images/ao-so-mi-nam.jpg",
        "created_at": "2024-12-06T11:50:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e7",
        "name": "Đồng hồ Casio G-Shock",
        "description": "Đồng hồ Casio G-Shock chống nước, thiết kế mạnh mẽ, bền bỉ.",
        "price": 3500000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d9",
            "name": "Đồng hồ",
            "created_at": "2024-12-06T08:50:00.000Z"
        },
        "stock_quantity": 80,
        "images": "https://example.com/images/casio-g-shock.jpg",
        "created_at": "2024-12-06T12:00:00.000Z"
    },
    {
        "_id": "60b8c5f3f1e2b8a7a5c8c6e8",
        "name": "Balo Adidas Classic",
        "description": "Balo Adidas Classic, thiết kế thể thao, chất liệu chống thấm nước.",
        "price": 1000000,
        "category_id": {
            "_id": "60a7b8c1f1e2b8a7a5c8c6d6",
            "name": "Phụ kiện",
            "created_at": "2024-12-06T08:40:00.000Z"
        },
        "stock_quantity": 120,
        "images": "https://example.com/images/balo-adidas.jpg",
        "created_at": "2024-12-06T12:10:00.000Z"
    }
];

module.exports = fakeData;
