const express = require('express');
const cors = require('cors');
const knex = require('knex');
const session = require('express-session');

const bcrypt = require('bcryptjs');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'piggybank'
    }
  });

  
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
      session({
          secret: 'somerandomstuff',
          saveUninitialized: true,
          resave: false,
          cookie: {
              httpOnly: true,
              maxAge: 3600000
            }
        })
        )
        
const requireAuth = (req, res, next) => {
    const { user } = req.session;
    if(!user) {
        return res.status(401).json({ message: 'Unauthorized'} );
    }
    next();
}

app.get('/', (req, res)=> {
    res.send('bla')
});


app.post('/signin', (req, res) => {
    const {email, password} = req.body;

    db.select('id', 'email', 'password').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
            bcrypt.compare(password, user[0].password, (error, response) => {
                if(response) {
                    req.session.user = user[0];
                    res.send(user[0]);
                } else {
                    res.send({message: 'Wrong password and/or username.'});
                }
            })
        });
});

app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log(err);
        }

        db('users')
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

app.listen(3001, () => {
    console.log('App is running on port 3001');
});
