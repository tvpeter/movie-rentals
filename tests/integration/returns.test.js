const {User} = require('../../models/user');
const request = require('supertest');
const {Rental} = require('../../models/rentals');
const mongoose = require('mongoose');
let server;
describe('/api/returns', ()=> {
    let token, customerId, movieId, rental;

    
    beforeEach( async()=> { server = require('../../app'); 
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

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
    })
    afterEach( async ()=> {  
       await server.close();
        await Rental.deleteMany({});
    })

    
//return 401 if user is not logged in
it('should return 401 if user is not logged in', async()=>{
    //token = new User({admin: true}).generateAuthToken();
    token = '';
    
    const res = await request(server).post('/api/returns').send({ customerId, movieId});
    expect(res.status).toBe(401);

});

//return 403 if user is not admin
// return 400 if customerId is not provided
// return 400 if movieId is not provided
// return 404 if rental is not found
// return 200 if request is valid
// set the return date
// calculate the rental fee
// increase the stock
// return the rental



});