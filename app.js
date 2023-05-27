const express = require('express');
const app = express();
const session = require("express-session");
const PORT = 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const store = new session.MemoryStore();
const db = require('./queries.js');

const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
})
);

app.use(passport.initialize());
app.use(passport.session());

// Strategy for loging users in
passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE usename = ?', [ username ], function(err, user) {
        
        // error occured
        if (err) { return cb(err); }
        
        // no error occured, but user doesn't exist or password is incorrect
        if (!user) { return cb(null, false, { message: 'Incorrect username or password.'}); }
        
        // no error occured, user found and password is correct
        return cb(null, user);
    });
}));

        // ROUTES //
// homepage
app.get('/', (request, response) => {
    response.send('Welcome to E-Commerce!');
});

    // LOG IN
// Route for logging in a user
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
    (request, response) => {
        response.redirect('/~' + request.user.username);
});

// Render login page
app.get('/login', (request, response) => {
    response.render('login');
});

    // PRODUCTS ROUTES
// Route for handling requests for getting all products
app.get('/products', db.getAllProducts);
// Route for handling requests for getting a product by id

app.get('/products/:id', db.getProduct);

// Route for handling requests for inserting a new product
app.post('/products', db.insertProduct);

// Route for handling requests for deleting a product by id
app.delete('/products/:id', db.deleteProduct);

        // USERS ROUTES
// Route for handling requests for getting all users
app.get('/users', db.getAllUsers);

// Route for handling request for getting a single user by id
app.get('/users/:id', db.getUser);

// Route for handling requests for registering new users
app.post('/users/register', db.registerUser);

// Route for handling requests for deleting a user by id
app.delete('/users/:id', db.deleteUser);

    // CART ROUTES
// Route for handling requests for getting all carts
app.get('/cart', db.getAllCarts);

// Route for handling requests for getting a cart by id
app.get('/cart/:id', db.getCart);

// Route for handling requests for inserting a new product into cart
app.post('/cart', db.addToCart);


// listening port
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});