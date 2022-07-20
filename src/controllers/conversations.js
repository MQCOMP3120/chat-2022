const auth = require('./auth')
const models = require('../models')


const createConversation = async (request, response) => {

    const creator = await auth.validUser(request)

    if (creator) {
        const title = request.body.title
        const conversation = new models.Conversation({creator, title})
        const returned = await conversation.save()

        if (returned) {
            url = `/api/conversations/${conversation._id}`
            response.json({status: "success", url: url, msgcount: 0})
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
        const conversations = await models.Conversation.find({})
                                          .populate('messages')
        response.json({conversations})
    } else {
        response.sendStatus(401)
    }

}

module.exports = { 
    createConversation, 
    getConversations
}