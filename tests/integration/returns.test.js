const {User} = require('../../models/user');
const request = require('supertest');
const {Rental} = require('../../models/rentals');
const mongoose = require('mongoose');
const moment = require('moment');
const {Movie} = require('../../models/movies');

describe('/api/returns', ()=> {
    let token, customerId, movieId, rental, movie;

    
    beforeEach( async()=> { server = require('../../app'); 
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'Movie title',
            numberInStock: 10,
            dailyRentalRate: 2,
            genre : {
                title: 'genre title'
            }
        });
        await movie.save();

         rental = new Rental({
            customer: {
                _id: customerId,
                name: 'CustomerName',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'Movie title',
                dailyRentalRate: 2
            },
            rentalFee: 8
        });
        await rental.save();
    });

    afterEach( async ()=> {  
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await server.close();
    })

    const exec = () => {
    return request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId});
    }

    
//return 401 if user is not logged in
it('should return 401 if user is not logged in', async()=>{
    //token = new User({admin: true}).generateAuthToken();
    token = '';
    
    const res = await exec();
    expect(res.status).toBe(401);

});

// return 400 if customerId is not provided
it('should return 400 if customerid is not provided', async ()=> {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);

});

// return 400 if movieid is not provided
it('should return 400 if movieId is not provided', async ()=> {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);

});

// return 404 if rental is not found
it('should return 404 if rental not found for the given movie/customer id', async ()=>{
    await Rental.remove({});
    
    const res = await exec();

    expect(res.status).toBe(404);


});

it('should return 400 if rental date is already set', async ()=> {
    rental.dateReturned = new Date();
    await rental.save();
    
    const res = await exec();

    expect(res.status).toBe(400);
});

it('should return 400 if rental date is already set', async ()=> {
    rental.dateReturned = new Date();
    await rental.save();
    
    const res = await exec();

    expect(res.status).toBe(400);
});

it('should return 200 if rental is found', async ()=> {
    
    const res = await exec();

    expect(res.status).toBe(200);
});

it('should set the returnDate for a valid request', async ()=> {
    
    const res = await exec();

    const rentalInDb = Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
});

it('should calculate the rental fee', async ()=> {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = Rental.findById(rental._id);

    rentalInDb.rentalFee = (rentalInDb.dateOut - new Date()) * 2;

    expect(rentalInDb.rentalFee).toBeDefined();
});

it('should increase the movie stock', async ()=> {
   
    const res = await exec();

    const rentedMovie = await Rental.findById(movieId);

    expect(rentedMovie.numberInStock).toBe(rentedMovie.numberInStock+1);
});

it('should return rental in the body of the response', async ()=> {
   
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'movie', 'customer', 'rentalFee', 'dateReturned']));
});

//return 403 if user is not admin


});