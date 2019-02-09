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
                // console.log('word found', w)
                res.send(w.lexicalCategory)
            } else {
                // console.log(word)
                const options = {
                    url: `https://od-api.oxforddictionaries.com/api/v1/entries/en/${word}`,
                    headers: {
                        app_id: APPID,
                        app_key: APPKEY
                    }
                }
                var grammar = 'undefined'
                const cb = (error, response, body) => {
                    
                    if(!error){
                        const b = JSON.parse(body)
                        grammar = b.results[0].lexicalEntries[0].lexicalCategory
                    }
                    res.send(JSON.stringify(grammar))
                }
                try{
                    rp(options)
                        .then(d => {
                            d = JSON.parse(d)
                            // res.send(JSON.stringify(d))
                            return d.results[0].lexicalEntries ? d.results[0].lexicalEntries[0].lexicalCategory : 'undefined'
                        }).catch(e => {console.log(e); res.send('undefined')})
                        .then(lexicalCategory => {
                            // console.log(lexicalCategory)
                            res.send(lexicalCategory)
                            const entry = new Word({word:word, lexicalCategory: lexicalCategory})
                            entry.save()
                        })
                        .catch(err => console.log('SECOND', err))
                    // const entry = new Word({word:word, lexicalCategory: grammar})
                    // entry.save()
                    } catch(e) {
                        console.log(e)
                        res.send('undefined')
                    }
            }   

        })
    })
    app.post('/api/sentence', (req,res) => {
        console.log(req.body)
        res.send('asdf')
    })
}