const winston = require('winston');
module.exports = function(err, req, res, next){
    //winston.log('error', err.message);
    winston.error(err.message, err);

    //error levels
    //error
    //warn
    //info
    //verbose
    //debug
    //silly
    return res.status(500).send('Something went wrong');
}