const request = require('supertest');
let server;
const {Genre} = require('../../models/genres');

describe('/api/genres', ()=> {
    beforeEach(()=> { server = require('../../app'); })
    afterEach( async ()=> { server.close(); 
       await Genre.remove({});
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
});