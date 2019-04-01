const express = require('express');
const helmet = require('helmet');

const usersRouter = require('./users/users-router')

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api', usersRouter)

module.exports = server;