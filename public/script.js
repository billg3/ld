$( document ).ready( function(){

const library = {},
    source = '#source-text', 
    userInput = '#user-input'

const getWords = function(s){
    const space = new RegExp(/\n/g)
    const regexp = new RegExp(/\,|\.|\:|\(|\)|\;|\'|\"|\↵/g)
    return $(s).val().toLowerCase().replace(space,' ').replace(regexp,'').split(' ').filter(e=>e!='')
}


const store = () => {
    const words = getWords(source)
    words.forEach((e,i)=>{
        if(library[e] == undefined) library[e] = {}
        if(library[e][words[i+1]] == undefined) library[e][words[i+1]] = 0
        library[e][words[i+1]] ++
        // console.log('working..')
    console.log(library)
    })
}

const storeTwo = function(){
    document.getElementById('user-input').value = 'loading...'
    const words = getWords(source)
    console.log(words)
    words.forEach((e,i)=>{
        console.log(words.length)
        if(i < words.length - 3){
            const two = `${e} ${words[i+1]}`
            if(library[two] == undefined) library[two] = {}
            if(library[two][words[i+2]] == undefined) library[two][words[i+2]] = 0
            library[two][words[i+2]] ++
        } 
    })
    document.getElementById('user-input').value = ''
    $('#submit')
        .text('ready')
        .css({'background-color':'green','color':'white','padding':'2px 4px','border':'0px'})
    $('#user-input').css('display','inline-block')
    $('#suggestion-container').css('display','block')
    console.log(library)
}

async function load(){
    // $('#loading').text('loading')
    return 1
}



$('#submit').click(function(){load().then(storeTwo())})

const suggest = e => {
    console.log(e)
    if(e.keyCode !== 32){return}
    const words = getWords(userInput),
        word = words[words.length - 1]
    suggestions = library[word]
    if(suggestions == undefined){ return }
    const r = [0,'']
    for(let w in suggestions){
        if(suggestions[w] > r[0]){ r[0] = suggestions[w]; r[1] = w} 
    }
    document.getElementById('user-input').value += r[1].length ? ` ${r[1]}` : '' 
    // return r[1]
}

const suggestTwo = e => {
    $('#submit').text('submit').css({'background-color':'white','color':'black','border':'1px solid black'})
    console.log(e)
    // if(e.keyCode !== 39){ return }
    // if(e.keyCode !== 39 || e.keyCode !== 32){ return }
    const words = getWords(userInput)
    if(words.length <= 1){ return }
    const two = `${words[words.length - 2]} ${words[words.length - 1]}`
    if(library[two] == undefined){ return }
    const r = [0,'']
    const suggestions = library[two]
    for(let word in suggestions){
        if(suggestions[word] > r[0]){ r[0] = suggestions[word]; r[1] = word}
    }
    $('#suggestion').text(r[1])
    console.log($('#suggestion'))
    if(e.keyCode !== 39){return}
    document.getElementById('user-input').value += ` ${r[1]} `
    $('#suggestion').text('')
    suggestTwo()
    console.log(r[1])
}

$('#user-input').keyup(e=>suggestTwo(e))



})