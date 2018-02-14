
var promiseDemo =function() {
    promise = new Promise(function(resolve, reject){
        document.body.addEventListener('click', function(event){
            test = {
                naam: 'alex'
            }            
        })
        resolve(test)
    })
    return promise 
} 

promiseDemo().then(function(data){
    console.log(data)
    return data 
}).then(function(data){
    console.log(data)
}).catch()


//  Wat gebeurt er met een catch onder een chain van .thens?
