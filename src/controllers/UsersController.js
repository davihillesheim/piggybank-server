const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

module.exports = {

  async signUp(req, res) {
    const {email, name, password } = req.body;
    let passwordHash;
  
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

    if(!user) {
      return res.status(400).send({ error: 'User not found'});
    }

    if(!await bcrypt.compare(password, user[0].password)) {
      return res.status(400).send({ error: 'Invalid email or password'});
    }

    res.send({user})
  }
}
