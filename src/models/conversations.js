const mongoose = require('mongoose')
const auth = require('./auth')

const conversationSchema = new mongoose.Schema({
    title: String,
    creator: String
  })
  
const Conversation = mongoose.model('Conversation', conversationSchema)

const createConversation = async (request, response) => {

    const creator = await auth.validUser(request)

    if (creator) {
        const title = request.body.title
        const conversation = new Conversation({creator, title})
        const returned = await conversation.save()

        if (returned) {
            url = `/api/conversations/${conversation._id}`
            response.json({status: "success", url: url})
        } else {
            response.json({status: "error"})
        }
    } else {
        response.sendStatus(401)
    }
}


const getConversations = async (request, response) => {

    const user = await auth.validUser(request)

    if (user) {
        const conversations = await Conversation.find({})
        response.json({conversations})
    } else {
        response.sendStatus(401)
    }

}

module.exports = {Conversation, createConversation, getConversations}