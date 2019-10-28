const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
// const router = require('./routes');
// const auth = require('./auth/index');
const cors = require('cors');
// const authMiddleware = require('./auth/middleware');


const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded({ extended: false }) );
// parse application/json
app.use(bodyParser.json());

app.use( cookieParser('keyboard_cat') );

// initialise session middleware - flash-express depends on it
app.use(session({
   secret: "keyboard cat",
   resave: false,
   saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(express.static('public'));

app.use(cors({
   credentials: true
}));

app.get('/', (req, res, next) => {
    res.json({
        home: 'The home page!!'
    });
});

app.get('/api/shoes', productsAPI.all);
app.get('/api/shoes/brand/:brandname', productsAPI.all);
app.get('/api/shoes/size/:size', productsAPI.all);
app.get('/api/shoes/brand/:brandname/size/:size', productsAPI.all);
app.post('/api/shoes/sold/:id', productsAPI.all);
app.post('/api/shoes', productsAPI.all);



//Define error-handling middleware functions
app.use(function (err, req, res, next) {
   res.status(500);
   res.render('error', { error: err });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
   console.log(`App started at http://localhost:${PORT}`);
});