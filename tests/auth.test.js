const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const auth = require('../src/controllers/auth')
const models = require('../src/models')


const api = supertest(app)

describe('auth', () => {

    beforeEach(async () => {
        await models.Session.deleteMany({username: 'bobalooba'})
    })

    test('post to register makes a cookie', async () => {
        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect({status: 'success'})
            .expect('Set-Cookie', /session=.*/)
    })

    test('second registration give an error status', async () => {
        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'success'})

        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'username taken'})
    })

    afterAll(() => {
        mongoose.connection.close()
    })

})