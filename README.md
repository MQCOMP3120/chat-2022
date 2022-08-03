# A Real-Time Chat Service

This repository is the starter kit for the COMP3120 Individual Project 
for 2022: a real time chat service.  The back-end implementation is 
in the `server` subdirectory.  The front-end project is homed in the 
main directory (with sources in `src`).  

## Configuration

Copy the file `.env.dist` to `.env` and edit the 

To run the front-end development server:

```bash
npm run start
```

This will run the server on port 3000.

## Backend Server

The project provides a backend service to support real time chat.   Users can
register and create new conversation topics, post and join conversations.
Real time chat is supported via web sockets.

To star the backend, run:

```bash
npm run server
```

To run the backend tests:

```bash
npm run test-server
```

### Routes

All API calls except for `/auth/register` should have
an `Authorization` header set to `Basic xxxxxx`  where `xxxxx` is the token returned when
the user registers.  

`/auth/register`

* `POST` - register a new username
  * request: `{"username": "bob"}`
  * response: `{"status": "username taken"}` or `{"status": "success", "username": "bob", "token": "xxxxxx"}`
    * The returned `token` value is used for authorization is subsequent requests.

`/auth/`

* GET - get the user details
  * response: {"status": "unregistered"} or `{"status": "success", "username": "bob", "token": "xxxxxx"}`

`/api/conversations/`

* `POST` - create a new conversation
  * requires a valid session cookie
  * request: `{"title": "conversation title"}`
  * response: `{"status": "success" | "unauthorised", "url": "url to post new messages"}

* `GET` - list conversations
  * requires a valid session cookie
  * response: `{"conversations": [{"title": "xyzzy", "msgcount": 99, "url": "conversation url"}]}`

`/api/conversations/:id`

* `GET` - list recent messages
  * requires a valid session cookie
  * query parameter `N` - number of messages, default 10
  * response: `{"messages": [{"creator": "usernamae", "text": "message text", "timestamp": "TTT", "url": "message url"}]}`

* `POST` - post a new message
  * requires a valid session cookie
  * request: `{"text": "message text"}`
  * response: `{"status": "success" | "unauthorised", "url": "message url"}`

`/api/conversations/:id/:messageid`

* `GET` - get message detail
  * requires a valid session cookie
  * response: `{"creator": "usernamae", "text": "message text", "timestamp": "TTT", "url": "message url"}`

* `DELETE` - delete message
  * requires a valid session cookie for the user who created the message
  * response: `{"status": "success" | "unauthorised"}

### Database

We use MongoDB to store data with the following tables.

#### Sessions

```json
{
    "_id": "session id used in cookie",
    "username": "unique username registered"
}
```

#### Conversations

```json
{
    "_id": "conversation id",
    "title": "conversation title",
    "creator": "username of creator"
}
```

#### Messages

```json
{
    "_id": "message id",
    "conversation": "conversation id",
    "user": "username of author",
    "timestamp": "ISO timestamp for message",
    "text": "markdown text of the message"
}
```
