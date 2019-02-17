const config = require('config');
const jwt = require('jsonwebtoken');

//this is needed to verify that sign-in users alone are given permission to routes that handle data modification

module.exports = function (req, res, next){
    //check if the user has a token
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied');

    //verify the token
    try{
    decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    //this will enable us access this as req.user._id
    req.user = decoded;
    next();
} catch(ex)
{
    return res.status(400).send('Invalid token');
}

}

//module.exports = auth;