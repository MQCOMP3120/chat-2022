const mongoose = require('mongoose')
const config = require('../config')

const initDB = async () => {
    await mongoose
        .connect(config.mongoDBUrl)
        .catch((error) => {    
            console.log('error connecting to MongoDB:', error.message)  
        })
    }
    
module.exports = { initDB }