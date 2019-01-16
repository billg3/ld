const _ = require('lodash')
// const language = require('@google-cloud/language')

// https://github.com/googleapis/nodejs-language/blob/master/samples/analyze.v1.js
// https://cloud.google.com/natural-language/docs/reference/rest/v1beta2/documents/analyzeSyntax

module.exports = (app,Word) => {
    app.route('/api/dictionary')
        .post((req,res) => {
            console.log(req.body)
            res.send('asdf')
        })
}