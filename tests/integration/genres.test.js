const request = require('supertest');
let server;
const {Genre} = require('../../models/genres');
const {User} = require('../../models/user');

describe('/api/genres', ()=> {
    beforeEach(()=> { server = require('../../app'); })
    afterEach( async ()=> { server.close(); 
       await Genre.deleteMany({});
    })

    describe('get genres', ()=> {
        it('should return all genres', async ()=> {
            Genre.collection.insertMany([
                {title: "The bloodshed elections", year: 2019, publisher: "Pego ICT Hub"},
                {title: "The irritating behaviour", year: 2018, publisher: "TV Peters Studio"}
            ]);

           const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(element => element.title === 'The bloodshed elections')).toBeTruthy();
            expect(res.body.some(element => element.title === 'The irritating behaviour')).toBeTruthy();
        });
    });

    describe(`/api/genres/:id`, ()=> {
        it('should return a genre with a valid given id', async ()=>{

        const genre = new Genre({title: "The bloodshed elections", year: 2019, publisher: "Pego ICT Hub"});
        await genre.save();
        const res = await request(server).get(`/api/genres/${genre._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', genre.title);

        });

        it('should return 404 if given id is invalid', async ()=>{
        const res = await request(server).get(`/api/genres/1`);
        expect(res.status).toBe(404);

        });
    });

    describe('POST genres', ()=> {
        it(`should return 401 if client is not logged in`, async ()=> {
        const res = await request(server).post('/api/genres')
                        .send({title: "The love of God", year: 2018, publisher: "Kings way"});
        expect(res.status).toBe(401);
        });

       it('should return 400 if publisher is not supplied', async () =>{
        //generate token for the user
        const token = new User().generateAuthToken();

        const genre = {title: "Favour am kind of feeling you", year: 2019};
        const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send(genre);
        
        expect(res.status).toBe(400);

       });

       it('should return 400 if title is less than 5 characters long', async ()=>{
        //generate user token
        const token = new User().generateAuthToken();
        const genre = {title: "me", year: 2018, publisher: 'Things the mind conceives' }
        const res = await request(server).post('/api/genres').set('x-auth-token', token).send(genre);
        expect(res.status).toBe(400);

       });

       it('should return 400 if title is more than 50 characters long', async ()=>{
        const token = new User().generateAuthToken();
        const title = new Array(52).join('a');
        const genre = {title, year: 2018, publisher: 'Things the mind conceives' }
        const res = await request(server).post('/api/genres').set('x-auth-token', token).send(genre);
        expect(res.status).toBe(400);

       });

    });


});