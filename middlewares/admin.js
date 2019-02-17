
module.exports = function (req, res, next){
    //check if the users' payload is an admin
    if(!req.user.isAdmin) return status(403).send('Access denied');
    next();
}