const xhr = new XMLHttpRequest()
xhr.open('POST','/api',true)
xhr.setRequestHeader('Content-Type','application/json')
xhr.send(JSON.stringify({value:'asdf'}))