const rp = require('request-promise')
const {APPID, APPKEY} = require('./../config.json')
console.log(APPID, APPKEY)


// https://github.com/googleapis/nodejs-language/blob/master/samples/analyze.v1.js
// https://cloud.google.com/natural-language/docs/reference/rest/v1beta2/documents/analyzeSyntax


module.exports = (app,Word,Sentence) => {
    app.post('/api/word', (req,res) => {
        const {word} = req.body
        
        Word.findOne({word:word}, (err,w ) => {
            if(w){
                res.send(JSON.stringify({ lexicalCategory:w.lexicalCategory, api:false }))
            } else {
                
                // set up oxford dictionary api call
                const options = {
                    url: `https://od-api.oxforddictionaries.com/api/v1/inflections/en/${word}`,
                    headers: { app_id: APPID, app_key: APPKEY }
                }
                rp(options)
                    .then(d => {
                        d = JSON.parse(d)
                        const lexicalCategory = d.results[0].lexicalEntries ? d.results[0].lexicalEntries[0].lexicalCategory : 'undefined'
                        // send lexical category and whether api was called 
                        res.send(JSON.stringify({ lexicalCategory:lexicalCategory, api:true }))
                        // save lexical category to db
                        const entry = new Word({ word:word, lexicalCategory:lexicalCategory })
                        entry.save()
                    })
                    .catch(err => {
                        console.log('err', word)
                        res.send(JSON.stringify({lexicalCategory:'undefined',api:true}))
                    })
            }   

        })
    })
    app.post('/api/sentence', (req,res) => {
        console.log(req.body)
        const {sentence} = req.body
        res.send('asdf')
        Sentence.findOne({sentence:sentence}).exec((err, results) => {
            console.log(results)
            if(!results){
                const s = new Sentence({sentence:sentence})
                s.save()
            } else {
                Sentence.findOneAndUpdate({sentence:sentence},{$inc: {count:1}}).exec((err, results) => {
                    console.log(err || results)
                })
            }
        })
    })
}