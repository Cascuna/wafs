import ApiSettings from '../apisettings.js';
import TemplateEngineObj from '../template.js';
import ApiCacheHandler from '../apicache.js';
import {displaySpinner} from '../utils.js';
import {hideSpinner} from '../utils.js';
export default class Request {
    constructor() {
        this.settings = new ApiSettings()
        this.request = new XMLHttpRequest()
        this.templateEngine = new TemplateEngineObj()
        this.apiCacheHandler = new ApiCacheHandler()            
    }

    // TODO: ANDERE FUNCTIE NAAM!
    send(path, extraSettings){
        displaySpinner()
        console.log(navigator.onLine)
        console.log(extraSettings)
        let itemsFromCache = this.apiCacheHandler.retrieveCachedItems(this.apiCacheHandler.key)
        console.log(itemsFromCache)
        if(itemsFromCache === false){
            console.log('Fetching data from API')
            let absolute_url = this.buildAbsoluteUrl(path, extraSettings, this.settings.format)
            this.request.open('GET', absolute_url, true)
            this._send()
        }
        else {
            this.success(itemsFromCache)
        }
    }

    buildAbsoluteUrl(path){
        let _baseUrl = this.settings.api + path + '?key=' + this.settings.key
        let absoluteUrl = _baseUrl
        console.log(arguments)
        let argWithNoPath = [...arguments]
        console.log(5, argWithNoPath)
        argWithNoPath = argWithNoPath.splice(0)
        for(let arg of argWithNoPath){
            if (arg !== undefined){
                console.log(arg)
                absoluteUrl += '&' + arg
            }
        }
     
        console.log(absoluteUrl)
        return absoluteUrl
    }

    success(responseText){
        hideSpinner()
    }

    failure(){
            this.templateEngine.render('apiconnectionerror.html', {}).then(renderedHtml => {
            let listview = document.getElementById("rijksmuseum-listview")
            listview.innerHTML = "";
            listview.insertAdjacentHTML('beforeend', renderedHtml)

            hideSpinner()
        }).catch(error => console.log(error))
    }

    cleanResponse(response){return response}


    onload(){
        self = this
        console.log('test')
        self.request.onload = function() {
           
            if (self.request.status >= 200 && self.request.status <= 400) {
                let responsejson = (JSON.parse(self.request.responseText))
                console.log(responsejson)
                let cleanedData = self.cleanResponse(responsejson)
                self.apiCacheHandler.cacheData(self.apiCacheHandler.key, cleanedData) 
                // let cleanedResponse = self.cleanResponse(parsedJson)
                // let cacheResponse = self.cacheRequest(self.key, cleanedResponse)
                self.success(cleanedData)
            } else {
                console.log('failure')
                self.failure(self.request)
            }
        }
        if(!navigator.onLine){
            console.log('failure')
            self.failure()
        }
    }

   

    _send(){
        this.onload()
        this.request.send()
    }
}
