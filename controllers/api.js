const _ = require('lodash')

module.exports = app => {
    app.route('/api')
        .post((req,res) => {
            console.log(req.body)
            res.send('asdf')
            const as = {a: 'value 1'}
            const df = {b: 'value 2'}
            const asdf = _.assign({a: 'value 3'}, as, df)
            console.log(asdf)
            
            const getRandom = () => Math.floor(Math.random() * 10)
            const randomList = _.times(5,getRandom)
            console.log(randomList)

        })
}