// const mongoose = require('mongoose')
const {Schema, model} = require('mongoose')

const sentenceSchema = new Schema({
    sentence: String,
    count: {
        type: Number,
        default: 0
    }
})

const Sentence = model('Sentence', sentenceSchema)
module.exports = Sentence
