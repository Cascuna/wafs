import ApiSettings from '../apisettings.js';
import ApiCacheHandler from '../apicache.js';
import TemplateEngine from '../template.js';
import Sections from '../sections.js';
import { displaySpinner, hideSpinner, renderSection } from '../utils.js';
export default class Request {
    constructor() {
        this.settings = new ApiSettings()
        this.xhr = new XMLHttpRequest()
        this.templateEngine = new TemplateEngine()
        this.apiCacheHandler = new ApiCacheHandler()
    }

    send(path, extraSettings) {
        /* Orchestrating function. Decides wheter to fallback on previous cached items
           or retrieve a new set. */

        this.extraSettings = extraSettings // This in particular makes the object quite state dependent 
        let itemsFromCache = this.apiCacheHandler.retrieveCachedItems(this.apiCacheHandler.key)
        displaySpinner()
        if (itemsFromCache === false) {
            if (!navigator.onLine) {
                this.failure()
            }
            console.log('Fetching data from API')
            let absolute_url = this.buildAbsoluteUrl(path, extraSettings, this.settings.format)
            this.xhr.open('GET', absolute_url, true)
            this.prepareRequest()
        } else {
            this.success(itemsFromCache)
        }
    }

    buildAbsoluteUrl(path) {
        const _baseUrl = this.settings.api + path + '?key=' + this.settings.key
            // arguments is een inmutable object, dus spreaden we de argumenten naar een andere variabele om te muteren.
        let argWithNoPath = [...arguments]
        let absoluteUrl = _baseUrl
        argWithNoPath = argWithNoPath.splice(0) //Het eerste argument is altijd het pad & dus niet nodig

        for (let arg of argWithNoPath) {
            if (arg !== undefined) {
                console.log(arg)
                absoluteUrl += '&' + arg
            }
        }

        return absoluteUrl
    }

    success(responseJSON) {
        hideSpinner()
    }

    failure() {
        this.templateEngine.render('apiconnectionerror.html', {}).then(renderedHtml => {
            console.log('fail') 
            let section = renderSection('error_message', renderedHtml)
            let sections = new Sections()
            sections.toggle('error_message')
            hideSpinner()
        }).catch(error => console.log(error))
    }

    reformatResponse(response) { return response }


    onload() {
        /* enforces the basic path A request object will follow on success or failure */
        this.xhr.onload = () => {    
            if (this.xhr.status >= 200 && this.xhr.status <= 400) {
                let responsejson = JSON.parse(this.xhr.responseText)
                let cleanedData = this.reformatResponse(responsejson)
                this.apiCacheHandler.writeToCache(this.apiCacheHandler.key, cleanedData)
                this.success(cleanedData)
            } else {
                this.failure(self.xhr)
            }
        } 
    }

    prepareRequest() {
        this.onload()
        this.xhr.send()
    }
}