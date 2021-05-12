const express = require('express');
const routes = express.Router();
routes.use(express.json());
const knex = require('./database/connection');

const CategoryController = require('./controllers/CategoryController');
const TransactionController = require('./controllers/TransactionController');
const UserController = require('./controllers/UsersController');

routes.get('/categories', (req, res)=> {
  knex('categories').then((results) => res.json(results))
});

routes.post('/signin', UserController.signIn);

routes.post('/register', UserController.signUp);

module.exports = routes;