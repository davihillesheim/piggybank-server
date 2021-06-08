const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

const bcryptHash = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
          console.log(err);
          reject(err);
      } else {
        resolve(hash);
      }
    })
  })
}

module.exports = {

  async signUp(req, res) {
    const {email, name, password } = req.body;
    
    // Takes the hash of the password to store in the DB
    const passwordHash = await bcryptHash(password);

    const trx = await knex.transaction();

    const user = {
      email,
      name,
      password: passwordHash
    }

    await trx('users').insert(user);
    await trx.commit();

    return res.json({
      email,
      name,
      passwordHash
    })
  },

  async signIn(req, res) {
    const {email, password} = req.body;

    const user = await knex.select('account_id', 'email', 'password').from('users').where('email', '=', email);

    // if no user is found, return the error
    if(!user[0]) {
      return res.status(400).send({ error: 'User not found'});
    }

    // if the password is wrong, return the error (ambiguous is safer)
    if(!await bcrypt.compare(password, user[0].password)) {
      return res.status(400).send({ error: 'Invalid email or password'});
    }

    // if everything checks out, return the user
    res.send(user[0])
  }
}
