const express = require('express');
const routes = express.Router();
routes.use(express.json());

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