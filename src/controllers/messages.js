const models = require('../models')
const auth = require('./auth')

const createMessage = async (request, response) => {

    const creator = await auth.validUser(request)

    if (creator) {
        const text = request.body.text
        const cid = request.params.id
        // check that this is a valid conversation

        const conversation = await models.Conversation.findOne({_id: cid})

        if (conversation) {

            const message = new models.Message({creator, conversation: conversation._id, text})
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
        const messages = await models.Message.find({conversation: id}).sort('timestamp')
        response.json({messages})
    } else {
        response.sendStatus(401)
    }
}

const getMessage = async (request, response) => {

    const user = await auth.validUser(request)

    if (user) { 
        const msgid = request.params.msgid
        const result = models.Message.findOne({_id: msgid})
        response.json(result)
    } else {
        response.sendStatus(401)
    }

}

const deleteMessage = async (request, response) => {

    const user = await auth.validUser(request)

    if (user) { 
        const msgid = request.params.msgid
        const message = await models.Message.findOne({_id: msgid})
        if (message.creator.toString() == user.toString()) {
            const result = await models.Message.deleteOne({_id: msgid})
            if (result.acknowledged) {
                response.json({status: 'success'})
            } else {
                response.json({'status': 'unable to delete message'})
            }
        } else {
            // not authorised to delete 
            response.sendStatus(401)
        }
        response.json(result)
    } else {
        response.sendStatus(401)
    }

}

module.exports = {
    createMessage, 
    getMessages,
    getMessage, 
    deleteMessage
}