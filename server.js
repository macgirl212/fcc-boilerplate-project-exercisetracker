const bodyParser = require('body-parser')
const connectDB = require('./db/connect')
const express = require('express')
const users = require('./routes/users')

const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users', users)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`server is connected to database and listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()