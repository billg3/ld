// const xhr = new XMLHttpRequest()
// xhr.open('POST','/api',true)
// xhr.setRequestHeader('Content-Type','application/json')
// xhr.send(JSON.stringify({value:'asdf'}))

const library = {},
    source = '#source-text', 
    userInput = '#user-input'

const getWords = s => {
    const regexp = new RegExp(/\,|\.|\:|\(|\)|\;/g)
    return $(s).val().toLowerCase().replace(regexp,'').split(' ').filter(e=>e!='')
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

$('#submit').click(()=>store())

const suggest = e => {
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

$('#user-input').keyup(e=>suggest(e))