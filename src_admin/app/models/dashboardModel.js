const fakeData = [
    {
        "_id": "648fa1c7e4b0b1c3c5a9d001",
        name: "Admin User",
        email: "admin@example.com",
        password: "hashed_password_123",  // Ensure this is hashed properly using bcrypt or similar
        role: "admin",
        emailToken: "abc12345token",  // Be mindful of token generation and expiration
        isVerified: true,
        loginMethod: "email",
        cart: [],
        created_at: new Date("2024-01-01T12:00:00Z").toISOString()  // Date format consistency
    },
    {
        "_id": "648fa1c7e4b0b1c3c5a9d002",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashed_password_456",  // Ensure this is hashed properly
        role: "user",
        emailToken: "def67890token",
        isVerified: false,
        loginMethod: "email",
        cart: [
            { productID: "648fa1c7e4b0b1c3c5a9p001", quantity: 2, total: 500 },
            { productID: "648fa1c7e4b0b1c3c5a9p002", quantity: 1, total: 300 }
        ],
        created_at: new Date("2024-01-02T14:30:00Z").toISOString()
    },
    {
        "_id": "648fa1c7e4b0b1c3c5a9d003",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "hashed_password_789",  // Ensure this is hashed properly
        role: "user",
        emailToken: "ghi54321token",
        isVerified: true,
        loginMethod: "google",
        cart: [
            { productID: "648fa1c7e4b0b1c3c5a9p003", quantity: 3, total: 900 }
        ],
        created_at: new Date("2024-01-03T08:45:00Z").toISOString()
    }
];

module.exports = fakeData;
