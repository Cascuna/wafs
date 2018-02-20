/* Code is geschreven in ES6, blocks geven hetzelfde effect als het iffes pattern
   Aldus, de klasses zijn niet direct via het window object te vinden.
*/
{
    let templateEngineInstance;
    let routerInstance;

    // WIP
    function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Spatie naar -
        .replace(/[^\w\-]+/g, '')       // Verwijder alle niet woordchars
        .replace(/\-\-+/g, '-')         // Squish --++ naar -
        .replace(/^-+/, '')             // Trim - van de start
        .replace(/-+$/, '');            // Trim - van het einde
    }


    /* het keywoord class hier is syntaxic sugar voor een Constructor Function.
    Dit is dan ook de reden dat een constructor() verplicht is binnen klasses.

    Het object wordt nog steeds aangemaakt aan de hand van prototype inheritance, 
    ook functies worden nog steeds als properties gebonden.

    */
    class App {
        constructor() {
            this.router = new Router()
            this.router.config({ mode: 'hash'})
            this.defineAppPaths(this.router)
        }

        defineAppPaths(router){
            // Stel de paden in waar naartoe geroute kan worden
            try { 
                router.add(/rijksmuseum\/schilder\/(.*)/, function() {
                    let rijskmuseumitem = new rijksmuseumPainterRequest()
                    rijskmuseumitem.getPainterList('collection', arguments)
                })
                router.add(/rijksmuseum\/(.*)/, function() {
                    let rijskmuseumitem = new rijksmuseumItemRequest()
                    rijskmuseumitem.getItem('collection/', arguments)
                })
               
                router.add(/rijksmuseum/, function() {
                    let rijksmuseum = new RijksmuseumListRequest()
                    rijksmuseum.getList('collection')
                }).listen()
            }
            catch {
                throw "There has been aan initialisation issue"
            }
        }
    }
    
   
    /* App.prototype.init, op deze manier bind je de functie naar het prototype
    en alleen naar de prototype. 
    Op de normale manier wordt het gebonden op de instantie van het object,
    wat als gevolg heeft dat elke insantie een eigen functie heeft.
     In plain JS is dit het standaard binden van de functie naar het "object" */
  
     class TemplateEngineObj{
        /*
        Eigen implementatie van een Template Engine.
        ondersteunt templatetags <% %> & complexere functies zoals if/for/else etc.
        */
        constructor(){
            // Singleton pattern
            // if (!templateEngineInstance) {
            //     templateEngineInstance = this;
            // }
            // else {
            //     return templateEngineInstance
            // }
            // Regex om op ALLE (/g) blocks die beginnen met <% en eindingen met %> te zoeken.
            this.dynamicBlockRegex = /<%([^%>]+)?%>/g
            // Functies welke niet gepusht moeten worden naar de array, maar gewoon uitgevoerd.
            this.escapeables = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g
            
            this.importTemplates = /(^( )?( implements ))(.*)?/g
            this.templateFolderPath = 'static/templates/'
    
            /* in deze lijst zit een array zodat we als string "lines.push()" hier aan kunnen appenden
            en javascript hier direct in kunnen toevoegen, en deze pas op het laatst pas te joinen.
            Hierdoor kun je bijv dingen doen als
            for(i of items){
                <li> <%i.naam%> <li>
            }
             */
            this.code = ['var lines=[];\n']
        }
            
        testFunc(html){
            let fakethis = this
            return new Promise(function(resolve, reject){
                console.log('testfunc', html)
                let templateName = html.substring(html.indexOf("(")+1, html.indexOf(")"))
                console.log('dit is raar', templateName)
                const sobj = new TemplateEngineObj()
                sobj.loadTemplate(fakethis.templateFolderPath, templateName)
                .then((result) => {
                    console.log()
                    let templatedHtml = html.replace('<% implements ('+ templateName +') %>', result)
                    console.log('bazinga', templatedHtml)

                    resolve(templatedHtml)
                    return templatedHtml})
    
               
            })
            //     if(js && line.match(this.importTemplates)){
            //         console.log(line.match(this.importTemplates))
           
            //         console.log(templateName, this.template)
            //         if(templateName !== this.template){
            //             console.log('doe de woesh')
            //             this.render(String(templateName), this.context, true).then(result => {
            //                 console.log('dit ding doeneen woesh', result)
            //                 // console.log(result)
            //                 // this.content += result
            //                 // resolve(result)}).catch(error => console.log(error))
            //                 // console.log(templateName)
            //                 return result
            //             })  
            //         }
            //     }
            // })
        }


        loadTemplate(templateFolderPath, FilePath){
            /* Probeert de aangegeven template in het aangegeven templateFolderPad te vinden en uittelezen
            Deze manier van abstractie zorgt ervoor dat de Template niet in een code block hoeft te staan,
            en veel leesbaarder is. 
            TODO: Een fallback functie zou leuk zijn, aldus inline HTML als templates niet werken.*/
            let fakescope = this
            return new Promise(function(resolve, reject){
                let absoluteTemplatePath = templateFolderPath + FilePath
                let request = new XMLHttpRequest()
                request.open("GET", absoluteTemplatePath)
                request.responseType = 'text'
                
                request.onload = function() {
                    if(request.response.includes('implements')){
                        fakescope.testFunc(String(request.response))
                        .then((html)=>{
                            console.log('dit is de resolved html', html)
                            resolve(html)
                            return html     
                        })
                    }
                    else{
                        resolve(request.response)
            }
                }
                request.error = function() {
                    reject(request.status, String(request.response))
                }
                return request.send()    
            })
         }
     
        add(line, js){
            // return new Promise((resolve, rejected) =>{
            
               
            // Check of de lines tekens bevatten die in escapables voor komen,
            // zoja, append 'as is', anders push het in de lines array
  
            js ? this.code += line.match(this.escapeables) ? line + '\n' : 'lines.push(' + line + ');\n' : 
            this.code += 'lines.push("' + line.replace(/"/g, '\\"') + '");\n'
            return

                
        }
    
        render(template, context, recursiveCall = false){
            console.log(template)
            this.template = template
            console.log(recursiveCall)
            console.log('render wordt aangeroepen?!?!?')
            this.context = context 
            return new Promise((resolve, rejected) => {
                this.loadTemplate(this.templateFolderPath, template)
                .then((html) => {
                    console.log('html contents', html)
                    this.code = ['var lines=[];\n']
                
                    // Gevonden <% %> block
                    let match 
                    // Cursor om onze positie in de HTML te bepalen
                    let cursor = 0
                    let resultaten = []
                    while(match = this.dynamicBlockRegex.exec(html)) {
                        // Hier gebruik ik html.slice met ded cursor & match index zodat niet elke keer de hele html
                        // toegevoegd wordt
                        this.add(html.slice(cursor, match.index))
                        this.add(match[1], true)
                        cursor = match.index + match[0].length;
                    }
    
                    // Voeg de resterende HTML toe
                    this.add(html.substr(cursor, html.length - cursor))
                    if(!recursiveCall){
                        this.code += 'return lines.join("");';
                        
                        // We gebruiken hier .apply zodat de scope van het script automatisch geset wordt, en
                        // we dus this.name etc kunneng ebruiken. Op deze manier hebben we geen params nodig.
                        // return new Promise((resolve, reject) => {
                        const runPreparedCode = Function(this.code.replace(/[\r\t\n]/g, ''))
                        let result = runPreparedCode.apply(context)
                        resolve(result)
                    } else {
                        console.log('enters this')
                        let toReturn = this.code.replace('var lines=[];', '')
                        console.log(toReturn)
                        resolve(toReturn)
                    }
                }).catch(error => console.log(error))
            })
        }
    }
     class Sections {
         constructor() {
            this.nav = document.querySelector("nav ul")
            this.sections = this.retrieveSections()
            this.fillNavBar()
        }

        toggle(hash){
            for(let section of this.sections){
                hash = hash.split("/")[0]
                if(section.id != hash){
                    document.getElementById(section.id).classList.add("hidden")
                }
                else{
                    document.getElementById(section.id).classList.remove("hidden")
                }       
            }
        }

        retrieveSections(){
            // queryselector verliest de link naar de dom, dit is de reden dat mensen getElementById gebruiken
            return document.querySelectorAll("section")    
        }

        createNavItem(section){
            let li = document.createElement("li")
           
            let anchor = document.createElement("a")
            anchor.href = "#" + section
            anchor.innerText = section

            li.appendChild(anchor)
            this.nav.appendChild(li)
        }

        fillNavBar(){
            /* Vult de navbar met <li> elementen voor alle <section>'s in de HTML. */
            for(let section of this.sections){
                this.createNavItem(section.id)
            }
        }
    }
    // TODO: Verplaats naar modules 
    class apiSettings {
        constructor(){
            this.api = 'https://www.rijksmuseum.nl/api/nl/'
            this.async = true
            this.key = 'qip4zAy0'
            this.format = 'json'
        }
    }

    class ApiCacheHandler {
        constructor(key){
            this.setCurrentKey(key)
        }

        setCurrentKey(key){
            this.key = key
        }

        cacheData(key, value){
            // Make a new CacheData entry
            console.log(value)
            let entryToCache = {value: value, timestamp: new Date().getTime()}
            localStorage.setItem(key, JSON.stringify(entryToCache))
            return JSON.parse(localStorage.getItem(key)).value
        }
        
        compareTime(cacheDate, now){
            let day = 1 //86000000 // Day in ms 
            return now - cacheDate <= day ? true : false  
        }

        retrieveCachedItems(key){
            try {
                let object = JSON.parse(localStorage.getItem(key))
                let cacheTimestamp = object.timestamp
                let nowTimestamp = new Date().getTime().toString()
                console.log('Cache entry is valid', this.compareTime(cacheTimestamp, nowTimestamp))
                if(!navigator.onLine) {
                    return object.value 
                }
                return this.compareTime(cacheTimestamp, nowTimestamp) ? object.value : false 

            }
            catch {
                return false 
            }
        }
    }
    class Request {
        constructor(type='GET') {
            this.settings = new apiSettings()
            this.request = new XMLHttpRequest()
            this.templateEngine = new TemplateEngineObj()
            this.apiCacheHandler = new ApiCacheHandler()            
        }

        // TODO: ANDERE FUNCTIE NAAM!
        send(path, extraSettings){
            console.log(navigator.onLine)
            console.log(extraSettings)
            let itemsFromCache = this.apiCacheHandler.retrieveCachedItems(this.key)
            if(itemsFromCache === false){
                console.log('Fetching data from API')
                let absolute_url = this.buildAbsoluteUrl(path, extraSettings, this.settings.format)
                console.log('lol')
                this.request.open('GET', absolute_url, true)
                console.log('er')
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

        success(responseText){return responseText}

        failure(){
                this.templateEngine.render('apiconnectionerror.html', {}).then(renderedHtml => {
                let listview = document.getElementById("rijksmuseum-listview")
                listview.innerHTML = "";
                listview.insertAdjacentHTML('beforeend', renderedHtml)
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

    class RijksmuseumListRequest extends Request {
        success(response){
            console.log(response)
            this.templateEngine.render('listview.html', {'objs': response}).then(renderedHtml => {
                let listview = document.getElementById("rijksmuseum-listview")
                listview.innerHTML = "";
                listview.insertAdjacentHTML('beforeend', renderedHtml)
            }).catch(error => console.log(error))
        }
        cleanResponse(response){
            let artists = Object.values(response.facets[0])
            console.log(artists)

            let rawArtObjects = Object.values(response.artObjects)
            let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)
            // Slugify de objecten. WIP
            artObjectsWithImage.forEach(element => {
                element.slug = slugify(element.title)
            });
            artObjectsWithImage.artists = artists[0].map(obj => obj = {url: encodeURI(obj.key), naam: obj.key})
            return artObjectsWithImage
        }

        getList(path){
            this.apiCacheHandler.setCurrentKey('rijksmuseumlist')
            this.send(path, 'ps=100')
        }
    }
    class rijksmuseumItemRequest extends Request {
        success(request){
            let jsonResponse = request
            jsonResponse = jsonResponse.artObject
            console.log(jsonResponse)
            let detailViewItem = this.templateEngine.render("detail.html", {'obj': jsonResponse})
            .then(function(detailViewItem) {
                let detailview = document.getElementById("rijksmuseum-detailview")
                detailview.innerHTML = "";
                detailview.insertAdjacentHTML('beforeend', detailViewItem)
            }).catch(error => console.log(error))
        }

        getItem(path, iteminfo){
            this.apiCacheHandler.setCurrentKey((iteminfo[0]))
            this.send(path + iteminfo[0])
        }
    }

    class rijksmuseumPainterRequest extends Request {
        success(request){
            let jsonResponse = request
            console.log(jsonResponse)
            jsonResponse = jsonResponse
            console.log(jsonResponse)
            let detailViewItem = this.templateEngine.render("listview-painter.html", {'objs': jsonResponse})
            .then(renderedHtml => {
                let listview = document.getElementById("rijksmuseum-listview")
                listview.innerHTML = "";
                listview.insertAdjacentHTML('beforeend', renderedHtml)
            }).catch(error => console.log(error))
        }

        cleanResponse(response){
            let artists = Object.values(response.facets[0])
            console.log(artists)
            let rawArtObjects = Object.values(response.artObjects)
            let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)
            // Slugify de objecten. WIP
            // artObjectsWithImage.forEach(element => {
            //     element.slug = slugify(element.title)
            // });
            artObjectsWithImage.artists = artists[0].map(obj => obj = {url: encodeURI(obj.key), naam: obj.key})
            console.log(artObjectsWithImage)
            return artObjectsWithImage
        }

        getPainterList(path, painterName){
            console.log(painterName)
            this.apiCacheHandler.setCurrentKey((painterName[0]))
            console.log(decodeURI(painterName[0]))
            let painter = decodeURI(painterName[0])
            this.send(path, 'involvedMaker=' + painter)
        }
    }
  
  
    class Router {
        constructor(){
            if(!routerInstance){
                routerInstance = this
            } else{
                return routerInstance
            }
            this.routes = []
            this.mode = null
            this.root = '/'
            // Eigenlijk alleen in hash mode
            this.hookHashListener()
        }

        hookHashListener(){
            this.sections = new Sections()
            console.log(this.sections)
            const routesthis = this;
            // De call naar de toggle functie is in een functie gewrapt, zodat de
            // scope die meegeven wordt niet 'hashchanged' is. 
            window.addEventListener("hashchange", function(event){
                routesthis.sections.toggle(location.hash.replace(/^#/, ""))
            });
        }

        config(options) {
            this.mode = options && options.mode && options.mode == 'history' 
                        && !!(history.pushState) ? 'history' : 'hash';
            this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
            return this;
        }
        

        getFragment(){
            let fragment = '';
            if(this.mode === 'history') {
                // Delete alle get params
                // We verwijderen hier de slashes zodat de invoer van urls minder specifiek is
                fragment = this.clearSlashes(decodeURI(location.pathname + location.search))
                fragment = fragment.replace(/\?(.*)$/, '')
                fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
            }else {
                var match = window.location.href.match(/#(.*)$/);
                // console.log(match)
                fragment = match ? match[1] : '';
            }   
            return this.clearSlashes(fragment)
        }

        add(re, handler, name=''){
            // Voeg een route adhv een reguliere expressie & functie "handler"toe
            if(typeof re == 'function'){
                handler = re
                re = ''
            }
            this.routes.push({'re': re, 'handler': handler})
            return this
        }

        remove(re){}

        flush(){
            // We willen misschien de router flushen on runtime ?
            this.routes = [];
            this.mode = null;
            this.root = '/';
            return this;
        }

        check(fragment){
            // Waar we naartoe willen, of waar we nu zijn
           fragment = fragment || this.getFragment() 
           for(let route of this.routes){
               let match = fragment.match(route.re)
               if(match) {
                   match.shift()
                   route.handler.apply({}, match)
                   return this
               }
           }
           return this
        }

        listen(){
            /* Start de router, vanaf dit punt zal hij in haken op route verandering*/
            let self = this;
            let current = self.getFragment();
            var fn = function(){
                if(current !== self.getFragment()){
                    current = self.getFragment();
                    self.check(current);
                }
            }
            // Fall back voor hash
            clearInterval(this.interval)
            this.interval = setInterval(fn, 500)
            return this
        }

        navigate(path){
            path = path ? path : '';
            if(this.mode === 'history') {
                history.pushState(null, null, this.root + this.clearSlashes(path));
            } else {        
                window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
            }
            return this;
        }

        clearSlashes(path){
            // Functie om een pad te cleanen
            return path.toString().replace(/\/$/, '').replace(/^\//, '')
        }
    }
    // Maak het app object pas aan als alle domcontent geladen is, zodat we de <section>'s kunnen zien.
    window.addEventListener("DOMContentLoaded", function() {
        const app = new App()
    })
}