const fakeUser = {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "hashedpassword123",
    "role": "admin",
    "emailToken": "random-email-token",
    "isVerified": true,
    "loginMethod": "email",
    "cart": [
        {
            "productID": "60d21b4667d0d8992e610c87",
            "quantity": 2,
            "total": 40.00
        },
        {
            "productID": "60d21b4667d0d8992e610c88",
            "quantity": 1,
            "total": 25.00
        },
        {
            "productID": "60d21b4667d0d8992e610c88",
            "quantity": 1,
            "total": 25.00
        }
    ],
    "created_at": new Date("2024-01-01T00:00:00Z")
};

module.exports = fakeUser;