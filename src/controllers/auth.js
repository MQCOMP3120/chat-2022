const models = require('../models')

/* Create a new session for a user */
const createSession = async (request, response) => {

    const session = new models.Session({
        username: request.body.username
    })

    const returned = await session.save()
        .catch((err) => {
            response.json({"status": "username taken"})
        })

    if (returned) {
        if (session._id) {
            // create a sesison cookie with the database id as the session key
            response.cookie('session', returned._id, {signed: true})
            response.json({"status": "success"})
        }
    }
}


/* 
 * validUser - check for a valid user via the session cookie 
 *   return the username if found, false if not
*/
const validUser = async (request) => {

    if (request.signedCookies) {
        const match = await models.Session.findOne({_id: request.signedCookies.session})  

        if (match) {
            return match._id
        }
    } 
    return false
}

module.exports = { validUser, createSession }
