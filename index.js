const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs')

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});



server.get('/hash', (req, res) => {
  const password = req.headers.authorization
  // read a password from the Authorization header
  if(password){

    const hash = bcrypt.hashSync(password, 8)
    // return an object with the password hashed using bcryptjs
    
    res.status(200).json({hash})
    // { hash: '970(&(:OHKJHIY*HJKH(*^)*&YLKJBLKJGHIUGH(*P' }
  } else {
    res.status(400).json({message: 'fix you stuff boi'})
  }
})



server.post('/api/register', (req, res) => {
  let user = req.body;


  const hash = bcrypt.hashSync(user.password, 12)

  user.password = hash

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});



server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  if(username && password){
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'YOU SHALL NOT PASS' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
    } else {
      res.status(400).json({message: 'fix you stuff boi'})
    }
});



server.get('/api/users', protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});



function protected(req){
  const {username, password} = req.headers

  if(username && password){
    next()
    // I forgot how to write middlewear XD
  }
}



const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
