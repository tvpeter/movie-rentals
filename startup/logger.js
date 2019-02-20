const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
//add transport for winston to log into file
winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/movies', level:'warn' })

//using the process object to log unhandled exceptions
// process.on('uncaughtException', (err)=>{
//     console.log('We got an uncaught exception');
//     winston.error(err.message, err);
// });



//example of an exception that may occur outside requests cycle and how to handle it
//throw new Error('There was an error during startup');

//example of unhandledRejection
// const p = Promise.reject(new Error('A promise has been rejected. Check it out'));
// p.then(()=> console.log('done'));


//using winston to catch exceptions
winston.handleExceptions(new winston.transports.File({ filename: 'uncaoughtExceptions.log'}));

//catching unhandledRejection
process.on('unhandledRejection', (err)=> {
    // winston.error(err.message, err);
    // process.exit(1);
    throw err;
});
}
