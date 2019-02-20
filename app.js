const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const config = require('config');
require('./startup/database')();

const app = express();
require('./startup/routes')(app);
//add transport for winston to log into file
winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/movies', level:'warn' })

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


//example of an exception that may occur outside requests cycle and how to handle it
//throw new Error('There was an error during startup');

//example of unhandledRejection
// const p = Promise.reject(new Error('A promise has been rejected. Check it out'));
// p.then(()=> console.log('done'));


const port = process.env.PORT || 4000;


app.listen(port, ()=>console.log(`Listening on port ${port}`));