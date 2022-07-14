const mongoose = require('mongoose')
const config = require('../config')

const sessionSchema = new mongoose.Schema({
    username: {type: String, unique: true}
  })
  
const Session = mongoose.model('Session', sessionSchema)

const conversationSchema = new mongoose.Schema({
    title: String,
    creator: mongoose.Types.ObjectId
  })
  
const Conversation = mongoose.model('Conversation', conversationSchema)


const messageSchema = new mongoose.Schema({
    text: String,
    creator: mongoose.Types.ObjectId,
    conversation: mongoose.Types.ObjectId
  })
  
const Message = mongoose.model('Message', messageSchema)



const initDB = async () => {
    await mongoose
        .connect(config.mongoDBUrl)
        .catch((error) => {    
            console.log('error connecting to MongoDB:', error.message)  
        })
    }

module.exports = { Session, Conversation, Message, initDB }
