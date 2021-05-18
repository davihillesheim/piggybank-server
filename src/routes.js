const express = require('express');
const routes = express.Router();
const cors = require('cors');
routes.use(express.json());
routes.use(cors())

const CategoryController = require('./controllers/CategoryController');
const TransactionController = require('./controllers/TransactionController');
const UserController = require('./controllers/UsersController');

// List categories
routes.get('/categories', CategoryController.categoryIndex);

// User requests
routes.post('/signin', UserController.signIn);
routes.post('/register', UserController.signUp);

// Transactions requests
routes.post('/expenses', TransactionController.createTransaction);
routes.post('/expenses/user', TransactionController.userTransactions);


module.exports = routes;