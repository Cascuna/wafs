import ApiSettings from '../apisettings.js';
import TemplateEngine from '../template.js';
import ApiCacheHandler from '../apicache.js';
import { displaySpinner } from '../utils.js';
import { hideSpinner } from '../utils.js';
export default class Request {
    constructor() {
        this.settings = new ApiSettings()
        this.xhr = new XMLHttpRequest()
        this.templateEngine = new TemplateEngine()
        this.apiCacheHandler = new ApiCacheHandler()
    }

    // TODO: ANDERE FUNCTIE NAAM!
    send(path, extraSettings) {
        displaySpinner()
        let itemsFromCache = this.apiCacheHandler.retrieveCachedItems(this.apiCacheHandler.key)
        if (itemsFromCache === false) {
            console.log('Fetching data from API')
            this.extraSettings = extraSettings
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
            let listview = document.getElementById("rijksmuseum-listview")
            listview.insertAdjacentHTML('beforeend', renderedHtml)
            hideSpinner()
        }).catch(error => console.log(error))
    }

    reformatResponse(response) { return response }


    onload() {
        self = this
        console.log('test')
        self.xhr.onload = function() {
            if (self.xhr.status >= 200 && self.xhr.status <= 400) {
                let responsejson = (JSON.parse(self.xhr.responseText))
                let cleanedData = self.reformatResponse(responsejson)
                self.apiCacheHandler.writeToCache(self.apiCacheHandler.key, cleanedData)
                self.success(cleanedData)
            } else {
                self.failure(self.xhr)
            }
        }
        if (!navigator.onLine) {
            self.failure()
        }
    }

    prepareRequest() {
        this.onload()
        this.xhr.send()
    }
}