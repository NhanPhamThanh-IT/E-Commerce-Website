const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const profileRoutes = require('./routes/profile');
const connection = require('../config/database');

const app = express();

const handlebars = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
});

handlebars.handlebars.registerHelper('subtract', (a, b) => a - b);
handlebars.handlebars.registerHelper('add', (a, b) => a + b);
handlebars.handlebars.registerHelper('gt', (a, b) => a > b);
handlebars.handlebars.registerHelper('lt', (a, b) => a < b);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/admin', homeRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/products', productRoutes);
app.use('/admin/orders', orderRoutes);
app.use('/admin/profile', profileRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
      await connection();

      app.listen(PORT, () => {
          console.log(`App listening on port ${PORT}`)
      })
  } catch (error) {
      console.log(">>> Error connect to DB: ", error)
  }
})()