$( document ).ready( function(){

const library = {}
const threeLibrary = {}
const source = '#source-text'
const userInput = '#user-input'

window.callApi = () => $.post('http://localhost:3000/api',('asdf'),data => console.log(data))

const getWords = function(s, removeSentences = true){
    const space = new RegExp(/\n/g)
    const regexp = removeSentences ? new RegExp(/\,|\.|\:|\(|\)|\;|\'|\"|\↵/g) : new RegExp(/\,|\:|\(|\)|\;|\'|\"|\!|\?/g)
    return $(s).val().toLowerCase().replace(space,' ').replace(regexp,'').split(' ').filter(e=>e!='')
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
    storeThree()
    document.getElementById('user-input').value = ''
    $('#submit').text('ready').css({'background-color':'green','color':'white','padding':'2px 4px','border':'0px'})
    $('#user-input').css('display','inline-block')
    $('#suggestion-container').css('display','block')
}

const storeThree = function(){
    const words = getWords(source)
    words.forEach((e,i)=>{
        if(i<words.length-3){
            if(threeLibrary[e] == undefined) threeLibrary[e] = {}
            if(threeLibrary[e][words[i+2]] == undefined) threeLibrary[e][words[i+2]] = 0
            threeLibrary[e][words[i+2]] ++
        }
    })
    console.log(threeLibrary)
}

 async function suggestThree(){
    const words = getWords(userInput)
    const choices = []
    if(words.length < 2){return}
    const word = words[words.length - 2]
    if(library[word] !== undefined){
        //console.log('three running suggest')
        const suggestions = library[word]
        for(let w in suggestions){
            if(suggestions[w] > 4){
                for(let i = 0; i<suggestions[w];i++){
                    choices.push(w)
                }
            }
        }
    }
    //console.log(choices, 'three choices')
    return choices
}

$('#submit').click(function(){storeTwo()})

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


async function sentenceAnalysis(choices){
    const url = 'https://language.googleapis.com/v1beta2/documents:analyzeSyntax '
    // analyze content of sentence

    // get sentence

    const sentences = getWords(userInput,false).join(' ').split('.')
    const sentence = sentences[sentences.length - 1]
    const newSentence = sentence.length ? false : true

    const req = {
        // document: {object('this is a sample sentence')},

    }

    $.post(url,{})

    console.log(sentence, sentences)

        // determine if begining of sentence

    // send sentence to API

    // tree for sentence structure

    // determine next word type(s) based on sentence

    // analyze choices to find best fit
    // if there are multiple acceptable options choose most heavily weighted

    // return next word and period if is end of sentence 
}

const suggestTwo = e => {

    $('#submit').text('submit').css({'background-color':'white','color':'black','border':'1px solid black'})
    console.log(e.keyCode, e.keyCode == 32)
    // if(e.keyCode !== 39){ return }
    if(e.keyCode !== 39 && e.keyCode !== 32){ return }
    let choices = []
    const words = getWords(userInput)
    // if(words.length <= 1){ return }
    const two = `${words[words.length - 2]} ${words[words.length - 1]}`
    if(library[words[words.length - 1]] == undefined){ return }
    const suggestions = library[two]
    for(let word in suggestions){
        for(let i = 0; i<suggestions[word]; i++){
            choices.push(word, word)
        }
    }
    // $('#suggestion').text(r[1])
    // console.log($('#suggestion'))
    // if(e.keyCode !== 39){return}


    const key = e.keyCode
    suggest().then(d => {
        // console.log(choices)
        // console.log(d)
        // choices = choices.concat(d)
        suggestThree().then(t => {
            // console.log(t)
            //console.log(choices)
            const nchoices = choices.concat(d) // .concat(d)

            //

            // sentenceAnalysis()

            // 
            // console.log(nchoices, 'nchoices')
            const clist = {}
            nchoices.forEach(e=>{
                clist[e] == undefined ?
                    clist[e] = 0 :
                    clist[e] ++
            })
            const choice = nchoices[Math.floor(Math.random() * nchoices.length)]
            // console.log(choice)
            $('#suggestion').text(choice)
            if(key !== 39){ return }
            document.getElementById('user-input').value += ` ${choice} `
            $('#suggestion').text('')
            suggestTwo()
        })
    })
    // console.log(one)
    // console.log(choices)
    // choices.concat(one)
    // console.log(choices)
    // document.getElementById('user-input').value += ` ${r[1]} `
    // $('#suggestion').text('')
    // suggestTwo()
    // console.log(r[1])
}

$('#user-input').keyup(e=>suggestTwo(e))



})