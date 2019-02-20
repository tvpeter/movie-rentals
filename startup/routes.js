const express = require('express');
const genres = require('../routes/genres');
const index = require('../routes/index');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/user');
const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function (app) {
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', index);

//special error middleware
app.use(error);

}