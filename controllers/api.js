const _ = require('lodash')
const request = require('request')
// const language = require('@google-cloud/language')

// https://github.com/googleapis/nodejs-language/blob/master/samples/analyze.v1.js
// https://cloud.google.com/natural-language/docs/reference/rest/v1beta2/documents/analyzeSyntax


async function addWord(word){
    //word = 'hello'
    // request(`https://od-api.oxforddictionaries.com/api/v1/entries/english/${word}?app_id`)
    //    .then(d => console.log(d))

    return await 'asdf'
}

module.exports = (app,Word) => {
    app.route('/api/dictionary')
        .post((req,res) => {
            const sentence = req.body.sentence.split(' ')
            sentence.forEach(e => {
                Word.find({word:e}).then(data => {
                    var grammarType
                    console.log(data)
                    // if word does not exist in db get it from api
                    if(!data.length) addWord().then(d => { grammarType = d })
                })
            })
            // Word.find()

            console.log(sentence)
            res.send('asdf')
        })
}