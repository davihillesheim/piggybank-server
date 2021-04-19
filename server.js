const express = require('express');
 
const app = express();
app.use(express.json())

const bcrypt = require('bcryptjs');

const database = {
    users: [
        {
            id: '123',
            name: 'davi',
            email: 'davi@gmail.com',
            password: 'password',
        },
        {
            id: '321',
            name: 'karol',
            email: 'karol@gmail.com',
            password: 'password',
        }
    ]
}

app.get('/', (req, res)=> {
    res.send(database.users)
});

app.post('/signin', (req, res) => {
    bcrypt.compare("password", '$2a$10$1Z6cLxiVoC30/KLVDBr.KuyMVAwohE077DBcAbzZ6132QWXmlD0mS', function(err, res) {
        console.log(res);
    });
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status('400').json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            console.log(hash)
        });
    });
    database.users.push({
        id: '999',
        name: name,
        email: email,
        password: password
    })
    res.json(database.users[database.users.length - 1]);
})

app.listen(3001, () => {
    console.log('App is running on port 3001');
});
