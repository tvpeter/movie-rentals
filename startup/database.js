const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function (){
return mongoose.connect('mongodb://localhost/movies')
.then(()=> winston.info(`Connected to Mongodb..`));
//to allow the process to be caught as uncaught rejected promise, we will remove the catch
//.catch(err => console.error(`Cannot connect to the DB..`));

}