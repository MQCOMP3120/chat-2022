const mongoose = require('mongoose')
const auth = require('./auth')
const convo = require('./conversations')

const messageSchema = new mongoose.Schema({
    text: String,
    creator: mongoose.Types.ObjectId,
    conversation: mongoose.Types.ObjectId
  })
  
const Message = mongoose.model('Message', messageSchema)

const createMessage = async (request, response) => {

    const creator = await auth.validUser(request)

    if (creator) {
        const text = request.body.text
        const cid = request.params.id
        // check that this is a valid conversation

        const conversation = await convo.Conversation.findOne({_id: cid})

        if (conversation) {

            const message = new Message({creator, conversation: conversation._id, text})
            const returned = await message.save()

            if (returned) {
                url = `/api/conversations/${conversation._id}/${returned._id}`
                response.json({status: "success", url: url})
            } else {
                response.json({status: "error"})
            }
        } else {
            response.sendStatus(404)
        }
    } else {
        response.sendStatus(401)
    }
}


const getMessages = async (request, response) => {

    const user = await auth.validUser(request)

    if (user) {
        const id = request.params.id
        const messages = await Message.find({conversation: id})
        response.json({messages})
    } else {
        response.sendStatus(401)
    }

}

const getMessage = async (request, response) => {

    const user = await auth.validUser(request)

    if (user) { 
        const msgid = request.params.msgid
        const result = Message.findOne({_id: msgid})
        response.json(result)
    } else {
        response.sendStatus(401)
    }

}

const deleteMessage = async (request, response) => {

}

module.exports = {
    Message, 
    createMessage, 
    getMessages,
    getMessage, 
    deleteMessage
}