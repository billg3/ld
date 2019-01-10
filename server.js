const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

const api = require('./controllers/api')
const html = require('./controllers/html')
api(app)
html(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))