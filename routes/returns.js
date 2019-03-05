const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rentals');
const auth = require('../middlewares/auth');
const {Movie} = require('../models/movies');
const Joi = require('joi');
const validate = require('../middlewares/validate');

router.post('/', [auth, validate(validateReturns)], async(req, res)=> {

    // if(!req.body.customerId) return res.status(400).send('CustomerID is not provided');
    // if(!req.body.movieId) return res.status(400).send('MovieID is not provided');

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if(!rental) return res.status(404).send('Rental with given customerid/movieid not found');

    if(rental.dateReturned) return res.status(400).send('Return already processed');

    //return method to calculate set the return date and calculate the rental fee
    rental.return(); 
    await rental.save();

    await Movie.update({_id: rental.movie._id}, { $inc : { numberInStock: 1}});

    return res.send(rental);
    
});

function validateReturns(req){
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    }
    return Joi.validate(req, schema);
    
}

module.exports = router;