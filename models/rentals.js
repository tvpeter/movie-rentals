const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name:{
                type: String,
                required: true,
                trim: true,
                minlength: 2
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                minlength: 5,
                maxlength: 15
            }
        })
    },
    movie : {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true
            }
        })
        
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date

    },
    rentalFee: {
        type: Number,
        min: 0,
        required: true
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){

    const schema = {
        customerId: Joi.string().required(),
        movieId:Joi.string().required()
    }
    return Joi.validate(rental, schema);
}

exports.validate = validateRental;
exports.Rental = Rental;