const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'E-Commerce-db1',
    password: 'postgres',
    port: 5432
});

// USERS
// Get all users from a database
const getAllUsers = (request, response) => {
    pool.query('SELECT * FROM users;', (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send('NO users found!');
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Get a single user from a database by id
const getUser = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1;', [ id ], (error, results) => {
        if (error) {
            throw error;   
        } else if (results.rows == '') {
            response.status(404).send('User NOT found!');
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Registering new user
const registerUser = (request, response) => {
    const { username, password } = request.body;
    
    pool.query(
        `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`,
        [ username, password ], (error, results) => {
        if (error) {
            throw error;
        } else {
            pool.query(`INSERT INTO cart (user_id) SELECT id FROM users WHERE username = '${username}' RETURNING *;`)
            response.status(200).send(`User created with username: ${username}. Cart created.`);
        }
    });
};

// Delete user from database by id
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send(`User with id ${id} NOT found!`);
        } else {
            response.status(200).send(`User deleted with id = ${id}.`);
        }
    });
};


// PRODUCTS
// Get all products
const getAllProducts = (request, response) => {
    pool.query('SELECT * FROM products ORDER BY id ASC;', (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send('NO products found!');
        } else {
        response.status(200).json(results.rows);
        }
    });
};

// Get a single product by id
const getProduct = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM products WHERE id = $1;', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send('Product NOT found!');
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Insert new product into database
const insertProduct = (request, response) => {
    const { name, category, quantity_available } = request.body;
    
    pool.query('INSERT INTO products (name, category, quantity_available) VALUES ($1, $2, $3) RETURNING *;', 
        [ name, category, quantity_available ], (error, results) => {
            if (error) {
                throw error;
            } else {
                response.status(201).json(results.rows);
            }
        });
    };
    
// Delete product by id
const deleteProduct = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM products WHERE id = $1;', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send(`Product with id ${id} not found!`);
        } else {
            response.status(200).send(`Product with id ${id} deleted.`);
        }
    });
};

  

// CART
// Get all carts
const getAllCarts = (request, response) => {
    pool.query('SELECT * FROM cart;', (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send('NO carts found!');
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Get a cart by id
const getCart = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM cart WHERE id = $1;', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send(`Cart with id: ${id} NOT found!`);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Insert a product into cart
const addToCart = (request, response) => {
    const { user_id, product_id, quantity } = request.body;

    pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;',
        (error, results) => {
            if (error) {
                throw error;
            } else {
                response.status(201).send('Item added to cart.');
            }
        });
};


module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    deleteUser,
    getAllProducts,
    getProduct,
    insertProduct,
    deleteProduct,
    getAllCarts,
    getCart,
    addToCart
};