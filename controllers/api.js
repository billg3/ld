const rp = require('request-promise')
const {APPID, APPKEY} = require('./../config.json')
console.log(APPID, APPKEY)


// https://github.com/googleapis/nodejs-language/blob/master/samples/analyze.v1.js
// https://cloud.google.com/natural-language/docs/reference/rest/v1beta2/documents/analyzeSyntax


module.exports = (app,Word,Sentence) => {
    app.post('/api/word', (req,res) => {
        const {word} = req.body
        
        Word.findOne({word:word}, (err,w ) => {
            // console.log(w)
            if(w){
                if(word == 'if'){}
                // console.log(word, w.lexicalCategory)
                res.send(JSON.stringify({ lexicalCategory:w.lexicalCategory, api:false, error:false, word:word }))
            } else {
                
                // set up oxford dictionary api call
                const options = {
                    url: `https://od-api.oxforddictionaries.com/api/v1/inflections/en/${word}`,
                    headers: { app_id: APPID, app_key: APPKEY }
                }
                rp(options)
                    .then(d => {
                        d = JSON.parse(d)
                        const lexicalCategory = d.results[0].lexicalEntries ? d.results[0].lexicalEntries[0].lexicalCategory : 'Proper Noun'
                        // send lexical category and whether api was called
                        
                        // console.log(word, lexicalCategory)
                        res.send(JSON.stringify({ lexicalCategory:lexicalCategory, api:true, error:false, word:word }))
                        // save lexical category to db
                        const entry = new Word({ word:word, lexicalCategory:lexicalCategory })
                        entry.save()
                    })
                    .catch(err => {
                        // console.log('err', err, word)
                        const {statusCode} = err
                        res.send(JSON.stringify({
                            lexicalCategory: statusCode == 403 ? 'err' : 'ProperNoun', 
                            api:true, 
                            error:true, 
                            word:word, 
                            errorMessage: statusCode == 403 ? 'api error' : 'word not found'
                        }))
                        if(statusCode !== 403){
                            const entry = new Word({ word:word, lexicalCategory:'ProperNoun' })
                            entry.save()
                        }
                    })
            }   

        })
    })
    app.post('/api/sentence', (req,res) => {
        // console.log(req.body)
        const {sentence} = req.body
        if(sentence.includes('err')){ return }
        res.send('asdf')
        console.log(sentence)
        Sentence.findOne({sentence:sentence}).exec((err, results) => {
            // console.log(results)
            if(!results){
                const s = new Sentence({sentence:sentence})
                s.save()
            } else {
                Sentence.findOneAndUpdate({sentence:sentence},{$inc: {count:1}}).exec((err, results) => {
                    // console.log(err || results)
                })
            }
        })
    })
    app.post('/api/sentences/find', (req,res) => {
        const {sentence} = req.body
        const regexp = new RegExp(`^${sentence}`)
        Sentence.find({sentence:regexp}).exec((err, results) => {
            if(results) {
                console.log('sentence', sentence)
                results.forEach(e => console.log(e.sentence, '\n'))
                res.send(JSON.stringify(results))
            }
            else res.send(JSON.stringify({err:true}))
        })
    })
}