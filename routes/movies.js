const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genres');
const {Movie, validate} = require('../models/movies');

router.get('/', async(req, res)=> {

    const movies = await Movie.find().sort('title');

    return res.send(movies);
});

router.post('/', async(req, res)=>{

    const {error} = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre id');

    const movie = new Movie({
        title : req.body.title,
        genre: {
            _id: genre._id,
            name: genre.title
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const result = await movie.save();
    return res.send(result);
});

router.get('/:id', async(req, res)=>{
    
    const movie = await Movie.findById(req.params.id);

    if(!movie) return res.status(404).send('Movie with given id not found');

    return res.send(movie);

});

router.delete('/:id', async(req, res)=>{
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if(!movie) return res.status(404).send('Movies with given id not found');

    return res.send(movie);
});

router.put('/:id', async(req, res)=> {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        genre: {_id: genre._id, name: genre.title},
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true});

    if(!movie) return res.status(404).send('Movie with given id not found');

    return res.send(movie);

});

module.exports = router;