const express = require('express');
const router = express.Router();


router.post('/', (req, res)=> {

    if(!req.body.customerId) return res.status(400).send('CustomerID is not provided');
    if(!req.body.movieId) return res.status(400).send('MovieID is not provided');
    
    res.status(401).send('Unauthorized access');

});

module.exports = router;