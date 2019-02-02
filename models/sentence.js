// const mongoose = require('mongoose')
const {Schema, model} = require('mongoose')

const sentenceSchema = new Schema({
    sentence: String
})

const Sentence = model('Sentence', sentenceSchema)
module.exports = Sentence
