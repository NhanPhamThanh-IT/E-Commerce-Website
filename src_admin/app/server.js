const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const profileRoutes = require('./routes/profile');
// const connectDB = require('./config/database');

// connectDB();

const app = express();

const handlebars = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Set the handlebars engine with the correct callback function
app.engine('handlebars', handlebars.engine); // Pass the 'engine' method here
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/', homeRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
