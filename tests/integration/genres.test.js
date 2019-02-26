const request = require('supertest');
const {Genre} = require('../../models/genres');
const {User} = require('../../models/user');
let server;

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

        //define the complete request payload and change the variables as needed
        let token, genre;
        const exec = async () => {
        return await request(server).post('/api/genres').set('x-auth-token', token).send(genre);

        }

        beforeEach( ()=> {
         genre = { title: "The love in my eyes for you", year: 2019, publisher: "Eleganza Gardens City"};
         token = new User().generateAuthToken();
        });


        it(`should return 401 if client is not logged in`, async ()=> {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
        });

       it('should return 400 if publisher is not supplied', async () =>{
        genre.publisher = '';
        const res = await exec();
        expect(res.status).toBe(400);
       });

       it('should return 400 if title is less than 5 characters long', async ()=>{
        genre.title = 'Me';
        const res = await exec();
        expect(res.status).toBe(400);
       });

       it('should return 400 if title is more than 50 characters long', async ()=>{
         genre.title = new Array(52).join('a');
        const res = await exec();
        expect(res.status).toBe(400);

       });

       it('should return save genre if it is valid', async ()=>{
        await exec();
        const res = Genre.findOne({title: 'The love in my eyes'});
        expect(res).not.toBeNull();

       });

       it('should return genre if it is valid', async()=>{
        const res = await exec();

        expect(res.body).toHaveProperty(`_id`);
        expect(res.body).toHaveProperty(`title`, `The love in my eyes for you`);
        expect(res.body).toHaveProperty(`year`, 2019);
        expect(res.body).toHaveProperty(`publisher`, `Eleganza Gardens City`);

       });

    });


});