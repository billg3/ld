const _ = require('lodash')
const language = require('@google-cloud/language')

// https://github.com/googleapis/nodejs-language/blob/master/samples/analyze.v1.js
// https://cloud.google.com/natural-language/docs/reference/rest/v1beta2/documents/analyzeSyntax

module.exports = app => {
    app.route('/api')
        .post((req,res) => {
            const client = new language.LanguageServiceClient()
            async function analyzeSyntaxOfText(){
                const text = 'this is sample text'

                const document = {
                    content: text,
                    type: 'PLAIN_TEXT'
                }
                const [syntax] = await client.analyzeSyntax({document}).catch(err => console.log(err))
                console.log('Tokens:')
                syntax.tokens.forEach(part=>{
                    console.log(`${part.partOfSpeech.Tag}: ${part.text.content}`)
                    console.log(`Morphology`, part.partOfSpeech)
                })
            }

            res.send('asdf')
        })
}