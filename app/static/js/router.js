import Sections from './sections.js';
let routerInstance;
export default class Router {
    constructor(){
        // if(!routerInstance){
        //     routerInstance = this
        // } else{
        //     return routerInstance
        // }
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
        console.log('?')
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