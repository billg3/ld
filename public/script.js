$( document ).ready( function(){

const library = {}
const threeLibrary = {}
const source = '#source-text'
const userInput = '#user-input'

const getWords = function(s, removeSentences = true){
    const space = new RegExp(/\n|—|\s\s/g)
    const p = new RegExp(/\./g)
    const text = $(s).val().toLowerCase().replace(p,' .')
    const regexp = removeSentences ? new RegExp(/,|\:|\(|\)|;|'|"|↵|\?|!|\[|\]/g) : new RegExp(/\,|\:|\(|\)|\;|\'|\"|\!|\?|—/g)
    return text.replace(space,' ').replace(regexp,'').split(' ').filter(e=>e!='')
}


const store = function(){
    const words = getWords(source)
    words.forEach((e,i)=>{
        if(library[e] == undefined) library[e] = {}
        if(library[e][words[i+1]] == undefined) library[e][words[i+1]] = 0
        library[e][words[i+1]] ++
    })
}

const storeTwo = function(){
    const words = getWords(source)
    words.forEach((e,i)=>{
        if(i < words.length - 3){
            const two = `${e} ${words[i+1]}`
            if(library[two] == undefined) library[two] = {}
            if(library[two][words[i+2]] == undefined) library[two][words[i+2]] = 0
            library[two][words[i+2]] ++
        } 
    })
    store()
    // storeThree()
    document.getElementById('user-input').value = ''
    $('#submit').text('ready').css({'background-color':'green','color':'white','padding':'2px 4px','border':'0px'})
    $('#user-input').css('display','inline-block')
    $('#suggestion-container').css('display','block')
}

window.storeSentences = () => {
    let calls = 0

    // get sentence
    const sentences = getWords(source,true).join(' ').split('.').filter(e => e.length)
    const sentence = sentences[sentences.length - 1]

    // console.log(sentence, sentence.length ? 'sentence' : 'new sentence')

    
    // https://developer.oxforddictionaries.com/documentation
    const url = 'https://od-api.oxforddictionaries.com/api/v1'
    // analyze content of sentence


    // determine if begining of sentence

    const newSentence = !sentence.length

    // send sentence to API

    // choices = choices.split(' ')


    let error = false;
    function lexicalContent(choices) {
        
        return new Promise(function(resolve, reject){
            let i = 0
            const a = []
            const sentencePromise = function(){
                // if there is an error do not call the api
                if(error){ console.log('api error'); return }
                // if the sentence is empty do not call the api
                if(!choices){ return }

                if(i >= choices.length){
                    // add END to the end of the list of lexical categories and send to api
                    a.push('END'); 
                    // console.log(a.join(' '), choices);
                    const sentence = {sentence:a.join(' ')}
                    $.ajax({
                        type:'POST',
                        url:'/api/sentence',
                        data:sentence
                    })
                    resolve(a)
                    return
                }
                
                const word = choices[i]
                const w = {word:word}
                let d = $.ajax({type:'POST',url:'/api/word',data:w, async:false})

                d = (JSON.parse(d.responseText))
                const {lexicalCategory, api, errorMessage} = d

                i++
                if(d.error){ if(errorMessage !== 'word not found'){ error = true }}
                a.push(lexicalCategory)
                const time = api ? 3000 : 0
                // api && (console.log(time, d))
                setTimeout(sentencePromise, time)
            }
            sentencePromise()
        })
        

    }

    let sentenceComplete = false
    const allSentences = i => {
        const choices = sentences[i].trim().split(' ').filter(e => e !== '')
        lexicalContent(choices).then(d => {console.log(d); i++, i<sentences.length && allSentences(i)})
    }

    allSentences(0)


    // sentences.forEach(e => {
    //     e = e.trim().split(' ').filter(e => e!== '')
    //     lexicalContent(e, 0)
    // })

    // lexicalContent()


    // tree for sentence structure

    // determine next word type(s) based on sentence

    // analyze choices to find best fit
    // if there are multiple acceptable options choose most heavily weighted

    // return next word and period if is end of sentence 
    return 0
}

// const storeThree = function(){
//     const words = getWords(source)
//     words.forEach((e,i)=>{
//         if(i<words.length-3){
//             if(threeLibrary[e] == undefined) threeLibrary[e] = {}
//             if(threeLibrary[e][words[i+2]] == undefined) threeLibrary[e][words[i+2]] = 0
//             threeLibrary[e][words[i+2]] ++
//         }
//     })
//     console.log(threeLibrary)
// }

//  async function suggestThree(){
//     const words = getWords(userInput)
//     const choices = []
//     if(words.length < 2){return}
//     const word = words[words.length - 2]
//     if(library[word] !== undefined){
//         //console.log('three running suggest')
//         const suggestions = library[word]
//         for(let w in suggestions){
//             if(suggestions[w] > 4){
//                 for(let i = 0; i<suggestions[w];i++){
//                     choices.push(w)
//                 }
//             }
//         }
//     }
//     //console.log(choices, 'three choices')
//     return choices
// }

$('#submit').click(function(){storeTwo()})
$('#source-text').keyup(function(e){
    if(e.keyCode == 13){
        storeTwo()
        $('#user-input').focus()
    }
})


async function suggest(e) {
    // if(e.keyCode !== 32){return}
    const choices = []
    const words = getWords(userInput),
        word = words[words.length - 1]
    suggestions = library[word]
    if(suggestions == undefined){ return }
    const r = [0,'']
    for(let w in suggestions){
        for(let i = 0; i<suggestions[w]; i++){
            choices.push(w)
        }
        if(suggestions[w] > r[0]){ r[0] = suggestions[w]; r[1] = w} 
    }
    // document.getElementById('user-input').value += r[1].length ? ` ${r[1]}` : '' 
    return choices
}

window.getWord = word => {
    $.post(`/api/word`, {word:word})
        .done(d => {console.log(d); window.word = d; return d})
        .catch(err => {console.log(err); return err})
}



async function wordGrammar(words){
    
    let sentences = getWords(userInput, false).join(' ').split('.')
    sentence = sentences[sentences.length - 1]
    console.log(sentence, sentences)
    if(sentence == ''){ return false }
    const sentenceGrammar = []

    sentence = sentence.split(' ')
    sentence.forEach(e => {
        console.log(e)
        let wordGrammar = $.ajax({type:'POST', url:'/api/word', data:{word:e}, async:false}).responseText
        wordGrammar = JSON.parse(wordGrammar).lexicalCategory
        console.log(wordGrammar)
        sentenceGrammar.push(wordGrammar)
    })
    
    const choicesGrammar = {}
    words = new Set(words)
    console.log(words)
    words.forEach(e => {
        const r = $.ajax({type:'POST', url:'/api/word', data: {word:e}, async:false}).responseText
        choicesGrammar[e] = JSON.parse(r).lexicalCategory
    })

    console.log(choicesGrammar)
    return [choicesGrammar, sentenceGrammar.join(' '), sentence.length]
}

let selection = ''

const suggestTwo = (e) => {

    // if users presses arrow set word to previously generated word
    if(e.keyCode == 39 ){        
        document.getElementById('user-input').value += selection == '.' ? `${selection} ` : ` ${selection}`
        selection = ''
        // generate next suggestion
        e.keyCode = 0
        suggestTwo(e)
        return
    }

    $('#submit').text('submit').css({'background-color':'white','color':'black','border':'1px solid black'})

    let choices = []
    const words = getWords(userInput)

    // get last two words from user input
    const two = `${words[words.length - 2]} ${words[words.length - 1]}`

    // if the most recently entered word does not exist do not try and create a reccomendation
    if(library[words[words.length - 1]] == undefined){ return }

    const suggestions = library[two]
    for(let word in suggestions){
        for(let i = 0; i<suggestions[word]; i++){
            choices.push(word, word)
        }
    }

    const key = e.keyCode
    suggest().then(d => {
        choices = choices.concat(d)

        wordGrammar(choices).then(choicesGrammar => {
            if(choicesGrammar){
                console.log(choicesGrammar)
                const sentences = $.ajax({type:'POST', url: '/api/sentences/find', data:{sentence:choicesGrammar[0]}, async:false})
                // const sentencesGrammar = JSON.parse(sentences.responseText)[0].sentence
                const sentencesGrammar = JSON.parse(sentences.responseText)
                console.log(sentencesGrammar, choicesGrammar[2])
                let endOfSentence;
                if(sentencesGrammar.length == 1) {
                    const nextWordGrammar = sentencesGrammar[0].sentence.split(' ')[choicesGrammar[2]]
                    endOfSentence = nextWordGrammar == 'END' ? true : false
                }

                if(!endOfSentence){
                    grammarFilteredChoices = choices.filter(e => {
                        sentencesGrammar.forEach(j => {
                            if(choicesGrammar[0][e] == j.sentence.split(' ')[choicesGrammar[2]]){ return true }
                            else {return false}
                        })
                        // choicesGrammar[0][e] == nextWordGrammar
                    })
                    choices = grammarFilteredChoices.length ? grammarFilteredChoices : choices
                    const index = Math.floor(Math.random() * choices.length)
                    choice = choices[index]
                } else {
                    choice = '.'
                }
            } else {
                const index = Math.floor(Math.random() * choices.length)
                choice = choices[index]
            }
            selection = choice

            if(words[words.length - 1] == '.'){
                selection = selection.split('')
                selection[0] = selection[0].toUpperCase()
                selection = selection.join('')
            }

            $('#suggestion').text(choice)
            if(key !== 39){ return }
        })

    //     const index = Math.floor(Math.random() * choices.length)
    //     const choice = choices[index]
    //     selection = choice

    //     if(words[words.length - 1] == '.'){
    //         selection = selection.split('')
    //         selection[0] = selection[0].toUpperCase()
    //         selection = selection.join('')
    //     }

    //     $('#suggestion').text(choice)
    //     if(key !== 39){ return }
    })

}

$('#user-input').keyup(e=>suggestTwo(e))



})