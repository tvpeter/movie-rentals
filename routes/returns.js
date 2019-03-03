const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rentals');
const auth = require('../middlewares/auth');


router.post('/', auth, async(req, res)=> {

    if(!req.body.customerId) return res.status(400).send('CustomerID is not provided');
    if(!req.body.movieId) return res.status(400).send('MovieID is not provided');
    
    const rental = await Rental.findOne({'movie._id': req.body.movieId, 'customer._id': req.body.customerId})
    if(!rental) return res.status(404).send('Rental with given customerid/movieid not found');

    if(rental.dateReturned) return res.status(400).send('Return already processed');
    rental.dateReturned = new Date();
    await rental.save();
    return res.status(200).send();
    
});

module.exports = router;