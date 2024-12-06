exports.index = (req, res) => {
    const fakeData = {
        users: 250,
        products: 500,
        orders: 150,
        
    };

    res.render('home/index', fakeData);
};
