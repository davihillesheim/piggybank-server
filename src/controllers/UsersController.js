const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

module.exports = {

  async signUp(req, res) {
    const {email, name, password } = req.body;
    let passwordHash;
    
    // Takes the hash of the password to store in the DB
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
          console.log(err);
      } else {
        passwordHash = hash;
      }
      
    });

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
    console.log(user)

    // if no user is found, return the error
    if(!user) {
      return res.status(400).send({ error: 'User not found'});
    }

    // if the password is wrong, return the error (ambiguous is safer)
    if(!await bcrypt.compare(password, user[0].password)) {
      return res.status(400).send({ error: 'Invalid email or password'});
    }

    // if everything checks out, return the user
    res.send({user})
  }
}
