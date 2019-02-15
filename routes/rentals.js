const express = require('express');
const {Rental, validate} = require('../models/rentals');
const {Customer} = require('../models/customers');
const {Movie} = require('../models/movies');
const Fawn = require('fawn');
const router = express.Router();
const mongoose = require('mongoose');

Fawn.init(mongoose);
router.get('/', async(req, res)=>{
    //fetch all the rental information
    const rentals = await Rental.find().sort('-dateOut');
    return res.send(rentals);
});

router.get('/:id', async (req, res)=>{

    //search for the rental id
    const rental = await Rental.findById(req.params.id);

    if(!rental) return res.status(404).send('Rental with the given details not found');

    //return the result
    return res.send(rental);
});

router.post('/', async(req, res)=>{
    //validate the request
    const {error} = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //check for the supplied id's
    const customer = await Customer.findById(req.body.customerId);

    if(!customer) return res.status(404).send('Customer with given id was not found');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send('Movie with given id not found');

    if(movie.numberInStock === 0) return res.status(400).send('The movie is not in stock');
    //create a new rental
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie : {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate : movie.dailyRentalRate
        },
        rentalFee: req.body.rentalFee
    });

    //decrement the number in stock
    // movie.numberInStock--;
    // movie.save();

    //save and return
    // const result = await rental.save();

    try {
    //rentals, movies are the collections in the db
    new Fawn.Task()
    .save('rentals', rental)
    .update('movies', {_id:movie._id}, {
        $inc: { numberInStock : -1 }
    })
    .run();

    return res.send(result);
    } catch (err){
        return res.status(500).send('Something went wrong');
    }
});

module.exports = router;

