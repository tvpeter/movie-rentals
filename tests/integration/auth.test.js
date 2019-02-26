const request = require('supertest');
const {User} = require('../../models/user');

let server;
describe('auth middleware', ()=>{
    let token;

    beforeEach(()=> {
        server = require('../../app');
        token = new User().generateAuthToken();
    });
    afterEach(()=> {
        server.close();
    })
    const genre = { title: 'The way things are going', year: 2019, publisher: 'Eleganza Gardens'}
    const exec = () => {
        return request(server).post('/api/genres').set('x-auth-token', token).send(genre);
    };
    
    it('should return 401 if token not provided', async ()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token provided is invalid', async ()=>{
        token = '1234';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if valid token is provided', async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
});