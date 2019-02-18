require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const index = require('./routes/index');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/user');
const auth = require('./routes/auth');
const config = require('config');
const error = require('./middlewares/error');

const app = express();
if(!config.get('jwtPrivateKey')){
    console.error('Fatal error: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/movies')
.then(()=> console.log(`Connected to Mongodb..`))
.catch(err => console.error(`Cannot connect to the DB..`));


const port = process.env.PORT || 4000;

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

app.listen(port, ()=>console.log(`Listening on port ${port}`));