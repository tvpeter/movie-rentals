
module.exports = () => {
    return (req, res, next) => {
        const { error } = validateReturns(req.body);
        if(error) return res.status(400).send(error.details[0].message);
       next();
    }
    }
    