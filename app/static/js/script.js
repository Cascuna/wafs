/* Code is geschreven in ES6, blocks geven hetzelfde effect als het iffes pattern
   Aldus, de klasses zijn niet direct via het window object te vinden.
*/
// Forceer strict, in het code block heeft strict geen effect 
'use strict'
{

    let instance;

    /* het keywoord class hier is syntaxic sugar voor een Constructor Function.
    Dit is dan ook de reden dat een constructor() verplicht is binnen klasses.

    Het object wordt nog steeds aangemaakt aan de hand van prototype inheritance, 
    ook functies worden nog steeds als properties gebonden.

    */
    class App{
        constructor() {
            this.router = new Router()
            this.router.config({ mode: 'hash'})
            this.defineAppPaths(this.router)
        }

        defineAppPaths(router){
            // Stel de paden in waar naartoe geroute kan worden
            try { 
                router.add(/rijksmuseum\/(.*)/, function() {
                    let rijskmuseumitem = new rijksmuseumItemRequest()
                    rijskmuseumitem.getItem('collection/', arguments)
                })
                router.add(/rijksmuseum/, function() {
                    let rijksmuseum = new RijksmuseumListRequest()
                    rijksmuseum.getList('collection')
                })
                router.listen()
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

    class Sections{
        constructor() {
            this.nav = document.querySelector("nav ul")
            this.sections = this.retrieveSections()
            this.fillNavBar()
        }

        toggle(hash){
            console.log(hash)
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
            console.log(this.nav)
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
    class Request {
        constructor(type='GET') {
            this.settings = new apiSettings()
            this.request = new XMLHttpRequest()
            this.configureObject()
            this.templateEngine = new TemplateEngineObj()
        }

        configureObject(){
            this.key = 'default'
        }

        send(path, type='GET'){
            let itemsFromCache = this.retrieveCachedItems(this.key)
            if(itemsFromCache === false){
                console.log('Fetching data from API')
                let absolute_url = this.buildAbsoluteUrl(path, this.settings.format)
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
            for(let arg of arguments){
                absoluteUrl += '&' + arg
            }
            return absoluteUrl
        }

        success(responseText){return responseText}

        failure(request){
            throw('er is een error voorgekomen in het request')
        }

        onload(){
            self = this
            self.request.onload = function() {
                if (self.request.status >= 200 && self.request.status <= 400) {
                    let parsedJson = JSON.parse(self.request.responseText)
                    let cleanedResponse = self.cleanResponse(parsedJson)
                    let cacheResponse = self.cacheRequest(self.key, cleanedResponse)
                    self.success(cacheResponse)
                } else {
                    self.failure(self.request)
                }
            }
        }

        cacheRequest(key, value){
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
                return this.compareTime(cacheTimestamp, nowTimestamp) ? object.value : false 
            }
            catch {
                return false 
            }
        }

        cleanResponse(response){return response}

        _send(){
            this.onload()
            this.request.send()
        }
    }
    class RijksmuseumListRequest extends Request {
        configureObject(){
            this.key = 'rijksmusemlist'
        }
        success(response){
            let result = this.templateEngine.render(
                "<%for(obj of this.objs) {%> <li> <a href=#rijksmuseum/<%obj.objectNumber%>> <%obj.title%> </a> </li> <%}%>", 
                    {'objs': response})
            let listview = document.getElementById("rijksmuseum-listview")
            listview.innerHTML = "";
            listview.insertAdjacentHTML('beforeend', result)
        }

        cleanResponse(response){
            let rawArtObjects = Object.values(response.artObjects)
            let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)
            return artObjectsWithImage
        }

        getList(path){
            this.send(path)
        }
    }
    class rijksmuseumItemRequest extends Request {
        configureObject(key){
            this.key = key
        }
        success(request){
            let jsonResponse = request
            jsonResponse = jsonResponse.artObject
            let detailViewItem = this.templateEngine.render(
                "<%this.obj.title%> <br/> <img class='basisimg' src=<%this.obj.webImage.url%>> <br/> <%this.obj.description%> <br/> <%this.obj.dating.sortingDate%>", {'obj': jsonResponse})
            
            let detailview = document.getElementById("rijksmuseum-detailview")
            detailview.innerHTML = "";
            detailview.insertAdjacentHTML('beforeend', detailViewItem)
        }

        getItem(path, iteminfo){
            this.configureObject(iteminfo[0])
            this.send(path + iteminfo[0])
        }
    }
    class TemplateEngineObj{
        /*
        Eigen implementatie van een Template Engine.
        ondersteunt templatetags <% %> & complexere functies zoals if/for/else etc.
        */
        constructor(){
            // Singleton pattern
            if (!instance) {
                instance = this;
            }
            else {
                return instance
            }
            // Regex om op ALLE (/g) blocks die beginnen met <% en eindingen met %> te zoeken.
            this.dynamicBlockRegex = /<%([^%>]+)?%>/g
            // Functies welke niet gepusht moeten worden naar de array, maar gewoon uitgevoerd.
            this.escapeables = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g

            /* in deze lijst zit een array zodat we als string "lines.push()" hier aan kunnen appenden
            en javascript hier direct in kunnen toevoegen, en deze pas op het laatst pas te joinen.
            Hierdoor kun je bijv dingen doen als
            for(i of items){
                <li> <%i.naam%> <li>
            }
             */
            this.code = ['var lines=[];\n']
        }
        add(line, js){
            // Check of de lines tekens bevatten die in escapables voor komen,
            // zoja, append 'as is', anders push het in de lines array
            js? this.code += line.match(this.escapeables) ? line + '\n' : 'lines.push(' + line + ');\n' :
            this.code += 'lines.push("' + line.replace(/"/g, '\\"') + '");\n';
        }

        render(html, context){
            this.code = ['var lines=[];\n']
            
            // Gevonden <% %> block
            let match 
             // Cursor om onze positie in de HTML te bepalen
            let cursor = 0
            while(match = this.dynamicBlockRegex.exec(html)) {
                // Hier gebruik ik html.slice met ded cursor & match index zodat niet elke keer de hele html
                // toegevoegd wordt
                this.add(html.slice(cursor, match.index))
                this.add(match[1], true)
                cursor = match.index + match[0].length;
            }

            // Voeg de resterende HTML toe
            this.add(html.substr(cursor, html.length - cursor));
            this.code += 'return lines.join("");';
            
            // We gebruiken hier .apply zodat de scope van het script automatisch geset wordt, en
            // we dus this.name etc kunneng ebruiken. Op deze manier hebben we geen params nodig.
            return new Function(this.code.replace(/[\r\t\n]/g, '')).apply(context);
        }
    }
  
    let routerinstance;
    class Router {
        constructor(){
            if(!routerinstance){
                routerinstance = this
            } else{
                return routerinstance
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
                console.log(routesthis)
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