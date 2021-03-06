const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    title: { type : String, minlength:5, maxlength: 50, required:true},
    year: {type: Number, required:true},
    publisher: {type: String, maxlength:50, required:true}
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const date = new Date();
    const year = date.getFullYear();

    const schema = {
        title: Joi.string().min(5).max(50).required(),
        year:Joi.number().integer().min(1800).max(year).required(),
        publisher:Joi.string().min(4).max(50).required()
    }
    return Joi.validate(genre, schema);
    
}
exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;