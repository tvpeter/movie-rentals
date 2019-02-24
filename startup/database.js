const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function (){
const db = config.get('db');
return mongoose.connect(db)
.then(()=> winston.info(`Connected to ${db} Mongodb..`));
//to allow the process to be caught as uncaught rejected promise, we will remove the catch
//.catch(err => console.error(`Cannot connect to the DB..`));

}