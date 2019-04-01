const express = require('express');
const router = express.Router()

const bcrypt = require('bcryptjs');

const db = require('../data/dbConfig.js');

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 8)
    user.password = hash;

   
    db('users')
    .insert(user)
    .then(ids => {
        const id = ids[0];
        db('users')
        .where({id})
        .then(users => {
            res.status(201).json(users)
        })
    })
    .catch(error => {
        res.status(500).json({message: `There was an error adding this to the db - ${error} `})
    })

})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    db('users')
    .where({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({message: `Welcome ${user.username}`})
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })

})

router.get('/users', restricted, (req, res) => {
    db('users')
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => res.send(error))
})

function restricted(req, res, next) {
    const {username, password} = req.headers;
    if(username && password) {
        db('users')
    .where({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
    } else {
        res.status(401).json({message: 'Please provide credentials'})
    }
}


module.exports = router;