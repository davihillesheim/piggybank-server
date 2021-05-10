const express = require('express');
const routes = express.Router();

const CategoryController = require('./controllers/CategoryController');
const TransactionController = require('./controllers/TransactionController');
const UserController = require('./controllers/UsersController');

routes.get('/categories', (req, res)=> {
  knex('categories').then((results) => res.json(results))
});

routes.post('/signin', (req, res) => {
  const {email, password} = req.body;

  console.log(email)

  knex.select('id', 'email', 'password').from('users')
      .where('email', '=', req.body.email)
      .then(user => {
          bcrypt.compare(password, user[0].password, (error, response) => {
              if(response) {
                  res.send(user[0]);
              } else {
                  res.send({message: 'Wrong password and/or username.'});
              }
          })
      });
});

routes.post('/register', (req, res) => {
  const {email, name, password } = req.body;
  
  bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
          console.log(err);
      }

      knex('users')
      .returning('*')
      .insert({
          email: email,
          name: name,
          password: hash
      })
      .then(user => {
          res.json(user);
      })
      .catch(err => {
          res.status(400).json('Unable to register');
      })
  });
});

module.exports = routes;