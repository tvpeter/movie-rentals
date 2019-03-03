const request = require('supertest');
const {Genre} = require('../../models/genres');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', ()=> {
  let server;
    beforeEach(()=> { server = require('../../app'); })
    afterEach( async ()=> { 
       await Genre.deleteMany({});
       await server.close(); 
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

        it('should return 404 if the given id is invalid', async ()=>{
        const res = await request(server).get(`/api/genres/1`);
        expect(res.status).toBe(404);

        });

        it('should return 404 if genre with given id is not found', async()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);
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

    
    describe('PUT /', ()=>{
    //we insert then return its id and edit 

    //return 400 if id is request is invalid
    let req, token, id, newReq;
    beforeEach ( async()=>{
     req = { title: "The love in my eyes for you", year: 2019, publisher: "Eleganza Gardens City"};
     token = new User().generateAuthToken();
     const genre = new Genre(req);
     await genre.save();
     id = genre._id;
     newReq = {title: 'Watching your emotions', year: 2018, publisher: 'Tales of a new life'}
    });
    
    const exec =  async() => {
    return await request(server).put(`/api/genres/${id}`).set('x-auth-token', token).send(newReq);
    }

    it('should return 401 if client is not logged in', async ()=> {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);

    });


    it('should return 400 if request does not contain all the properties', async ()=> {
        newReq.publisher = '';
        const res = await exec();
        expect(res.status).toBe(400);

    });

    //return 400 if req payload is not valid

    //return 404 if not found
    it('should return 404 if genre with the given id is not found', async ()=> {
        id = mongoose.Types.ObjectId();

        const res = await exec();
        expect(res.status).toBe(404);

    });

    // update genre if request and id are valid
    it('should update and return 200 if genre with the given id is found', async ()=> {
        await exec();
        const updatedGenre = await Genre.findById(id);

        expect(updatedGenre.publisher).toMatch(/Tales of a new life/);
    });

    });

    describe('DELETE /:id', () => {
        let token; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          genre = new Genre({ title: 'the things we see', year: 2017, publisher:'Evans publishers' });
          await genre.save();
          
          id = genre._id; 
          token = new User({ isAdmin: true }).generateAuthToken();     
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = new User({ isAdmin: false }).generateAuthToken(); 
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1; 
          
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if no genre with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the genre if input is valid', async () => {
          await exec();
    
          const genreInDb = await Genre.findById(id);
    
          expect(genreInDb).toBeNull();
        });
    
        it('should return the removed genre', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', genre._id.toHexString());
          expect(res.body).toHaveProperty('name', genre.name);
        });
      });

});