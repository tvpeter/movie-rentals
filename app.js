const winston = require('winston');
require('winston-mongodb');
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

//add transport for winston to log into file
winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/movies', level:'warn' })

const app = express();
if(!config.get('jwtPrivateKey')){
    console.error('Fatal error: jwtPrivateKey is not defined');
    process.exit(1);
}
//using the process object to log unhandled exceptions
// process.on('uncaughtException', (err)=>{
//     console.log('We got an uncaught exception');
//     winston.error(err.message, err);
// });

//using winston to catch exceptions
winston.handleExceptions(new winston.transports.File({ filename: 'uncaoughtExceptions.log'}));


//catching unhandledRejection
process.on('unhandledRejection', (err)=> {
    // winston.error(err.message, err);
    // process.exit(1);
    throw err;
});

mongoose.connect('mongodb://localhost/movies')
.then(()=> console.log(`Connected to Mongodb..`))
.catch(err => console.error(`Cannot connect to the DB..`));

//example of an exception that may occur outside requests cycle and how to handle it
//throw new Error('There was an error during startup');

//example of unhandledRejection
// const p = Promise.reject(new Error('A promise has been rejected. Check it out'));
// p.then(()=> console.log('done'));


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