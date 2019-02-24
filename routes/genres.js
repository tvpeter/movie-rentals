const express = require('express');
const {Genre, validate} = require('../models/genres');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const mongoose = require('mongoose');
const validateObjectId = require('../middlewares/validateObjectId');


router.get('/',  async (req, res, next)=>{
    //throw new Error('Cannot get genres');
    const genres = await Genre.find().sort('title');
    res.send(genres);
});

router.post('/', auth, async (req, res)=>{

    const { error } = validate(req.body);
    // if(result.error) 
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre =  new Genre({
        title: req.body.title,
        year: req.body.year,
        publisher : req.body.publisher
    });

    const rs = await genre.save();

    //genres.push(genre);
    
   return res.send(rs);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    // const schema = {
    //     id: Joi.number().integer().required()
    // }
    // const result = Joi.validate(req.params, schema);
    // if(result.error) return res.status(400).send(result.error.details[0].message);

    // const genre = genres.find(genre=>genre.id === parseInt(req.params.id));

    //Moving this to middleware
    //if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid id');

    const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('Movie not found');

    return res.send(genre);
});

router.put('/:id', auth, async (req, res)=>{
    //validate the request that it contains what to change
    //if not return 400

    //thought a request can contain only the property to be changed but it should bring all ppties instead
    //so am gonna comment this out and use the all ppties approach
    // const schema = Joi.object().keys({
    //     title : Joi.string().min(4),
    //     year:Joi.number().integer().min(1800).max(year),
    //     publisher:Joi.string().min(4)
    // }).or('title', 'year', 'publisher');
    
    // const result = Joi.validate(req.body, schema);

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //search for the resource if not return 404
    //const genre = genres.find(g => g.id === parseInt(req.params.id));

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        year : req.body.year,
        publisher : req.body.publisher
    }, { new: true});
    if(!genre) return res.status(404).send('Movie not found');

    //change the resource
    //return the result
    // if(req.body.title) genre.title = req.body.title;
    // if(req.body.year) genre.year = req.body.year;
    // if(req.body.publisher) genre.publisher = req.body.publisher;
     res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res)=>{
    //validate the request
    // const schema = {
    //     id: Joi.integer().required()
    // }
    //const result = Joi.validate(req.params, schema);
   // if(result.error) return res.status(400).send(result.error.details[0].message);


    //search for the item
    const genre = await Genre.findByIdAndRemove(req.params.id);
   // const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('Movie not found');


    //delete the item
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    //return the item
     res.send(genre);
});

module.exports = router;