const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const app = express()
const URI = 'mongodb://jtc7537:jtc7537@ds115350.mlab.com:15350/ld'

mongoose.Promise = Promise
mongoose.connect(URI)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

const api = require('./controllers/api')
const html = require('./controllers/html')
const Word = require('./models/words')
api(app, Word)
html(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))