const express = require('express')
const auth = require('./models/auth')
const conv = require('./models/conversations')

const router = express.Router()
 
router.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

router.post('/auth/register', auth.createSession)

/* GET conversations returns a list of all current conservations */
router.get('/api/conversations', conv.getConversations)

/* POST to conversations creates a new conversation */
router.post('/api/conversations', conv.createConversation)

/* GET a conversation returns the list of the last N conversations */
router.get('/api/conversations/:id', (request, response) => {
    if (auth.validUser(request)) {
        const id = request.params.id
        const conversation = model.getConversation(id)
        response.json(conversation)
    } else {
        response.json({status: "unauthorised"})
    }
})

/* POST to a conversation to create a new message */
router.post('/api/conversations/:id', (request, response) => {
    if (auth.validUser(request)) {
        const id = request.params.id
        const message = request.body
        const result = model.addMessage(id, message)
        response.json(result)
    } else {
        response.json({status: "unauthorised"})
    }
})

/* GET a message URL to get details of a message */
router.get('/api/conversations/:id/:msgid', () => {})


/* DELETE to message URL to delete the message */
router.delete('/api/conversations/:id/:msgid', (request, response) => {
    if (auth.validUser(request)) {
        const id = request.params.id
        const msgid = request.params.msgid
        const result = model.deleteMessage(id, msgid)
        response.json(result)
    } else {
        response.json({status: "unauthorised"})
    }
})


module.exports = router 