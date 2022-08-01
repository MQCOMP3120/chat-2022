const app = require('./app')
const models = require('./models')

models.initDB()

const PORT = 8201
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

