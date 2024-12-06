// Fake in-memory "database"
let fakeDatabase = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
];

class Product {
    static findAll() {
        return fakeDatabase;
    }

    static create(data) {
        const newProduct = {
            id: fakeDatabase.length + 1,
            ...data,
        };
        fakeDatabase.push(newProduct);
        return newProduct;
    }
}

module.exports = Product;
