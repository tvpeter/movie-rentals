const request = require('supertest');
let server;

describe('/api/genres', ()=> {
    beforeEach(()=> { server = require('../../app'); })
    afterEach(()=> { server.close(); })

    describe('get genres', ()=> {
        it('should return all genres', async ()=> {
           const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
        });
    });
});