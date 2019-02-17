const express = require('express');
const {Genre, validate} = require('../models/genres');
const router = express.Router();
const auth = require('../middlewares/auth');

// const genres = [
//     { id: 1, title:'Black Panther', year: 2018, publisher: 'Nollywood'},
//     { id: 2, title:'Lionheart', year: 2019, publisher: 'Netflix'},
//     { id: 3, title:'Tales of the Night', year: 2006, publisher: 'Bollywood'},
//     { id: 4, title:'24 hours', year: 2015, publisher: 'Kannywood'},
//     { id: 5, title:'Merlin', year: 2001, publisher: 'Britswood'}
// ];

router.get('/', async (req, res)=>{
    //res.send(genres);
    const genres = await Genre.find().sort('title');
    res.send(genres);
});

router.post('/', auth, async (req, res)=>{

    // const schema = {
    //     title: Joi.string().required().min(5),
    //     year:Joi.number().required().integer().min(1800).max(year),
    //     publisher:Joi.string().required().min(4)
    // }
    
    // const result = Joi.validate(req.body, schema);

    const { error } = validate(req.body);
    // if(result.error) return res.status(400).send(result.error.details[0].message);
    if(error) return res.status(400).send(error.details[0].message);

    
    const genre =  new Genre({
        //id: genres.length+1,
        title: req.body.title,
        year: req.body.year,
        publisher : req.body.publisher
    });

    const rs = await genre.save();

    //genres.push(genre);
    
   return res.send(rs);
});

router.get('/:id', async (req, res)=>{
    // const schema = {
    //     id: Joi.number().integer().required()
    // }
    // const result = Joi.validate(req.params, schema);
    // if(result.error) return res.status(400).send(result.error.details[0].message);

    // const genre = genres.find(genre=>genre.id === parseInt(req.params.id));

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

router.delete('/:id', auth, async (req, res)=>{
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