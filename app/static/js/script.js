/* Code is geschreven in ES6, blocks geven hetzelfde effect als het iffes pattern
   Aldus, de klasses zijn niet direct via het window object te vinden.
*/


'use strict'
{
    /* het keywoord class hier is syntaxic sugar voor een Constructor Function.
    Dit is dan ook de reden dat een constructor() verplicht is binnen klasses.

    Het object wordt nog steeds aangemaakt aan de hand van prototype inheritance, 
    ook functies worden nog steeds als properties gebonden.

    */
    class App{
        constructor() {
            this.routes = new Routes()
            this.init()
        }

        init(){
            console.log("Ik ben geinitaliseerd!")
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
            /* Vult de navbar met <li> elementen voor alle <section>'s in de HTML.
            */
            for(let section of this.sections){
                this.createNavItem(section.id)
            }
        }

    }

    class Routes    {
        constructor() {
            this.sections = new Sections()
            this.init()
        }
        init(){
            self = this;

            console.log(self)
            // De call naar de toggle functie is in een functie gewrapt, zodat de
            // scope die meegeven wordt niet 'hashchanged' is. 
            window.addEventListener("hashchange", function(event){
                self.sections.toggle(location.hash.replace(/^#/, ""))
            });
        }
    }

// var request = new XMLHttpRequest();
// request.open('GET', '/my/url', true);

// request.onload = function() {
//   if (request.status >= 200 && request.status < 400) {
//    // Success!
//     var data = JSON.parse(request.responseText);
//   } else {
//    // We reached our target server, but it returned an error

//   }
// };

// request.onerror = function() {
//  // There was a connection error of some sort
// };
class apiSettings {
    constructor(){
        this.api = 'https://www.rijksmuseum.nl/api/nl/'
        this.async = true
        this.key = 'qip4zAy0'
        this.format = 'json'
    }
}

    class Request {
        constructor(path='collection/', type='GET') {
            this.settings = new apiSettings()
            this.request = new XMLHttpRequest()
            this.absolute_url = this.settings.api + path + '?key=' + this.settings.key + '&format=' + this.settings.format
            console.log(this.absolute_url)
            this.request.open('GET', this.absolute_url, true)
            
            this.send()
        }
        success(responseText){
            console.log(responseText)
            let response = JSON.parse(responseText)
            console.log(response['artObjects'])
            this.buildTemplate(response['artObjects'])
            return response
        }

        buildTemplate(objs){
            this.templateengine = new TemplateEngineObj()
            this.objs = objs
            let result = this.templateengine.render(
                "<%for(obj of this.objs) {%> <%obj.title%> <%}%>", {'objs': this.objs})
            console.log(result)
            let listview = document.getElementById("rijksmuseum-listview")
        }

        failure(request){
            console.log(request.status)
            console.log(request.responseText)
        }

        onload(){
            self = this
            self.request.onload = function() {
                if (self.request.status >= 200 && self.request.status <= 400) {
                    self.success(self.request.responseText)
                } else {
                    self.failure(self.request)
                }
            }
        }

        send(){
            this.onload()
            this.request.send()
        }
    }

    let instance;
    class TemplateEngineObj{
        constructor(){
                // Singleton principe
            if (!instance) {
                instance = this;
            }
            else {
                return instance
            }
            // Regex om op ALLE (/g) blocks die beginnen met {{ en eindingen met }}
            this.dynamicBlockRegex = /<%([^%>]+)?%>/g
            // Functies welke niet gepusht moeten worden naar de array, maar gewoon uitgevoerd.
            this.escapeables = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g
            this.code = ['var changes=[];\n']
            
            // het concateneren van de strings zou voor errors zorgen,
            // dus gebruik ik een array waar ik alles naar schrijf, en de waarde vervolgens join
            // Ik zet deze array in code, omdat dit de hele representatie van de code is, we beginnen met
            // de array declaratie
            

           
        }
        add(line, js){
            // Check of de lines tekens bevatten die in escapables voor komen,
            // zoja, append 'as is', anders push het in de changes array
            js? this.code += line.match(this.escapeables) ? line + '\n' : 'changes.push(' + line + ');\n' :
            this.code += 'changes.push("' + line.replace(/"/g, '\\"') + '");\n';
        }

        render(html, context){
            this.code = ['var changes=[];\n']
            let match 
             // Cursor om onze positie in de HTML te bepalen
            let cursor = 0
            while(match = this.dynamicBlockRegex.exec(html)) {
        
                console.log(match)
                // Add the HTML section
                this.add(html.slice(cursor, match.index))
                // replace
                this.add(match[1], true)
                cursor = match.index + match[0].length;
                // html = html.replace(match[0], options[match[1]])
                console.log(html)
            }
            this.add(html.substr(cursor, html.length - cursor));
            this.code += 'return changes.join("");';
            console.log(this.code)
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
                   console.log(match)
                   return this
               }
           }
           return this
        }

        listen(){
            let self = this;
            let current = self.getFragment();
            var fn = function(){
                if(current !== self.getFragment()){
                    current = self.getFragment();
                    self.check(current);
                }
            }
            // clearInterval(this.interval);
            // this.interval = setInterval(fn, 50);
            // return this;
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
            return path.toString().replace(/\/$/, '').replace(/^\//, '')
        }
    }

    // let instance = null;
    const TemplateEngine = function(html, options){
       
        let dynamicBlockRegex = /<%([^%>]+)?%>/g, match
        let escapeables = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g

        
        let code = ['var changes=[];\n']
        let cursor = 0
        
        var add = function(line, js){
            js? code += line.match(escapeables) ? line + '\n' : 'changes.push(' + line + ');\n' :
            code += 'changes.push("' + line.replace(/"/g, '\\"') + '");\n';
        }

        while(match = dynamicBlockRegex.exec(html)) {
            add(html.slice(cursor, match.index))
            add(match[1], true)
            cursor = match.index + match[0].length;
            console.log(html)
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return changes.join("");';
        console.log(code)
        // Apply roept de functie aan met de scope & parameters gegeven
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    }

    const r = new Router()
    r.add(/products\/(.*)\/edit\/(.*)/, function() {
        console.log('products', arguments);
    }).check('/products/12/edit/22')
    /*
<%if(this.showSkills) {%>' +
    '<%for(var index in this.skills) {%>' + 
    '<a href="#"><%this.skills[index]%></a>' +
    '<%}%>' +
'<%} else {%>' +
    '<p>none</p>' +
'<%}%>';
    */
   
    // let testhtml = '<%if (this.name) {%>' +
    // '<%for(var index in this.types) {%>' + 
    // '<a href="#"><%index%></a>' +
    // '<%}%>' +
    // '<%} else {%>' +
    //     '<p>none</p>' +
    // '<%}%>';
    // const t = new TemplateEngineObj()
    // t.constructTemplate(testhtml,
    //     {name: "Alex"})
    // console.log(TemplateEngine(testhtml, {
    // name: "Alex",
    // profile: { age: 22 },
    // types: [1,2,3,4,5,6]
    // }))
    // var template = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
    // console.log(TemplateEngine(template, {
    // name: "Krasimir",
    // age: 29

    /*
    var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}


    */

    // Maak het app object pas aan als alle domcontent geladen is, zodat we de <section>'s kunnen zien.
    window.addEventListener("DOMContentLoaded", function() {
        const app = new App()
        const request = new Request()
    })
}