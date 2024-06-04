const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const postgres = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'smart-brain',
  },
});
/*
postgres.select('*').from('users').then(data => {
  console.log(data);
}
);*/

/*const database = {
  users: [
    {
      name: 'akshat',
      id: '12',
      email: 'akshat@gmail.com',
      password: '1234',
      entries: 0,
      joindate: new Date()
    },
    {
      name: 'anshika',
      id: '13',
      email: 'anishika@gmail.com',
      password: 'asdf',
      entries: 0,
      joindate: new Date()
    }
  ]
}
*/
const app = express();

app.use(bodyParser.json())
app.use(cors());


app.get('/', (req, res) => {
  res.send(database.users);
})


app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if(!email||!password){
    return res.status(404).json('invalid credentials');
  }
  postgres.select('email', 'hash').from('login')
    .where('email', '=', email) // Use the provided email
    .then(data => {
      const isvalid = bcrypt.compareSync(password, data[0].hash);
      if (isvalid) {
        return postgres.select('*').from('users')
          .where('email', '=', email) // Use the provided email
          .then(user => {
            res.status(200).json(user[0]);
          })
          .catch(err => res.status(400).json('Unable to login'));
      } else {
        res.status(404).json('Wrong credentials');
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'));
});



app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!email||!password||!name){
      return res.status(404).json('invalid credentials');
    }
    const hash = bcrypt.hashSync(password);

    // Begin a transaction with PostgreSQL
    await postgres.transaction(async trx => {
      // Insert the hash and email into the 'login' table within the transaction
      await trx('login').insert({
        hash: hash,
        email: email
      });

      // Insert user details into the 'users' table within the transaction
      const [user] = await trx('users')
        .returning('*')
        .insert({
          email: email, // Use the email provided, not the one retrieved from 'login' table
          name: name,
          joined: new Date()
        });

      // Respond with JSON indicating successful user registration
      res.json({ statusCode: 200, data: user, message: 'user registered' });

      // Commit the transaction
      await trx.commit();
    });
  } catch (error) {
    console.log('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  //let found = false;
  postgres.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user);
      }
      else {
        res.status(400).json('error logging in')
      }
    })
})

app.put('/increment-image-entries', (req, res) => {
  const { id } = req.body;
  postgres('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.status(200).json(entries[0].entries);
    })
    .catch(err => res.status(400).json('error getting entires'));
})

app.post('/imageurl', (req, res) => {
  
})


app.listen(3000, () => {
  console.log('listening on port 3000');
})
