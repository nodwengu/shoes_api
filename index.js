const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');

const app = express();

const ShoesAPI = require('./api/shoes-api');
const ShoeService = require('./services/shoe-service');
const { Pool, Client } = require('pg');

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/shoes_api_db';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

const shoeService = ShoeService(pool);
const shoesAPI = ShoesAPI(shoeService);



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

//setup template handlebars as the template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

app.use(cookieParser('keyboard_cat'));

app.get('/', (req, res, next) => {
  res.json({
    home: 'The home page!!'
  });
});

app.get('/api/shoes', shoesAPI.all);
app.get('/api/shoes/brand/:brandname', shoesAPI.allByBrand);
app.get('/api/shoes/size/:size', shoesAPI.allBySize);
app.get('/api/shoes/brand/:brandname/size/:size', shoesAPI.allByBrandSize);
app.get('/api/shoes/brand/:brandname/size/:size/color/:color', shoesAPI.allByBrandSizeColor);
app.get('/api/shoes/delete/:id', shoesAPI.deleteShoe);
app.post('/api/shoes/sold/:id', shoesAPI.updateStock);
app.post('/api/shoes/cancel/:id', shoesAPI.addStock);
app.post('/api/shoes', shoesAPI.add);
app.post('/api/shoes/update', shoesAPI.update);

app.get('/api/cart', shoesAPI.allFromBasket);
app.post('/api/cart', shoesAPI.createCart);
app.get('/api/cart/delete', shoesAPI.deleteFromBasket);
app.get('/api/basket/brand/:brandname/size/:size/color/:color', shoesAPI.getOneFromCart);
app.post('/api/basket/updateQuantity/:id', shoesAPI.increaseQuantity);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`App started at http://localhost:${PORT}`);
});