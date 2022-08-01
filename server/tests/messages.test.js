const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const models = require('../src/models')

const api = supertest.agent(app)

describe('api', () => {

    beforeEach(async () => {
        await models.Session.deleteMany({username: 'bobalooba'})
    })

    test('make a  message', async () => {

        let conversation

        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'success'})

        await api.post('/api/conversations')
            .send({title: "A test conversation"})
            .expect(200)
            .then(response => {
                conversation = response.body
            })

        await api.post(conversation.url)
        .send({text: "A test message"})
        .expect(200)
        .expect(response => {
            const val = response.body
            if (!val.status == 'success') throw new Error(`Expected status "success" but got ${val.status}`)
            if (!val.url.match(/\/api\/conversations\/\w+\/\w+/)) throw new Error(`expected url got ${val.url}`)
        })
    })

    /* 
    test('make a message - not authorised', async () => {

        await api.post('/api/conversations')
            .send({title: "A test message"})
            .expect(401)
    })
    */
   
    test('get list of messages', async () => {

        let conversation

        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'success'})

        await api.post('/api/conversations')
            .send({title: "A test conversation"})
            .expect(200)
            .then(response => {
                conversation = response.body
            })

        await api.post(conversation.url)
            .send({text: "1 A test message"})
            .expect(200)

        await api.post(conversation.url)
            .send({text: "2 Another test message"})
            .expect(200)

        await api.post(conversation.url)
            .send({text: "3 and another"})
            .expect(200)
            
        await api.get(conversation.url) 
        .expect(200)
        .expect(response => {
            const val = response.body
            if (!val.messages) throw new Error('expected conversations in response')
        }) 
        
    })

    /*
    test('get list of messages - not authorised', async () => {

        await api.get('/api/messages')
            .expect(401)
    })

    */

    test('delete a  message', async () => {

        let conversation
        let message

        await api.post('/auth/register')
            .send({username: 'bobalooba'})
            .expect(200)
            .expect({status: 'success'})

        await api.post('/api/conversations')
            .send({title: "A test conversation"})
            .expect(200)
            .then(response => {
                conversation = response.body
            })

        await api.post(conversation.url)
        .send({text: "A test message"})
        .expect(200)
        .expect(response => {
            message = response.body
            if (!message.status == 'success') throw new Error(`Expected status "success" but got ${message.status}`)
            if (!message.url.match(/\/api\/conversations\/\w+\/\w+/)) throw new Error(`expected url got ${message.url}`)
        })

        /* now try to delete it */
        await api.delete(message.url)
        .expect(200)
        .expect({'status': 'success'})

    })

    afterAll(() => {
        mongoose.connection.close()
    })

})