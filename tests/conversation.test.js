const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const auth = require('../src/models/auth')

const api = supertest.agent(app)

describe('api', () => {

    beforeEach(async () => {
        await auth.Session.deleteMany({username: 'bobalooba'})
    })

    test('make a  conversation', async () => {

        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'success'})

        await api.post('/api/conversations')
            .send({title: "A test conversation"})
            .expect(200)
            .expect((response) => {
                const val = response.body
                if (val.status != 'success') throw new Error(`expected status=success in response, got ${val.status}`)
                if (!val.url.match(/\/api\/conversations\/\w+/)) throw new Error(`expected url got ${val.url}`)
            })            
    })

    test('make a conversation - not authorised', async () => {

        await api.post('/api/conversations')
            .send({title: "A test conversation"})
            .expect(401)
    })

    test('get list of conversations', async () => {

        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'success'})

        await api.get('/api/conversations')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect(response => {
                const val = response.body
                if (!val.conversations) throw new Error('expected conversations in response')
            })         
    })

    test('get list of conversations - not authorised', async () => {

        await api.get('/api/conversations')
            .expect(401)
    })

    afterAll(() => {
        mongoose.connection.close()
    })

})