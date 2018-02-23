import Sections from './sections.js';

let routerInstance;
export default class Router {
    constructor() {
        if (!routerInstance) {
            routerInstance = this
        } else {
            return routerInstance
        }
        this.routes = []
        this.mode = null
        this.root = '/'
        this.sections = new Sections()
            // Eigenlijk alleen in hash mode
        this.hookHashListener()
    }

    hookHashListener() {
        // De arrow functie heeft geen this(context) dus voor een anonieme functie zoals dit is het ideaal.
        this.sections.toggle(location.hash.replace(/^#/, ""))
        console.log(' router', performance.navigation.type == 1)
        window.addEventListener("hashchange", (event) => {
            this.sections.toggle(location.hash.replace(/^#/, ""))
        });
    }

    config(options) {
        this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
        return this;
    }


    getFragment() {
        let fragment = '';
        if (this.mode === 'history') {
            // Delete alle get params
            // We verwijderen hier de slashes zodat de invoer van urls minder specifiek is
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search))
            fragment = fragment.replace(/\?(.*)$/, '')
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            var match = window.location.href.match(/#(.*)$/);
            // console.log(match)
            fragment = match ? match[1] : '';
        }
        return this.clearSlashes(fragment)
    }

    add(re, handler) {
        // Voeg een route adhv een reguliere expressie & functie "handler"toe
        if (typeof re == 'function') {
            handler = re
            re = ''
        }
        this.routes.push({ 're': re, 'handler': handler })
        return this
    }

    flush() {
        // We willen misschien de router flushen on runtime ?
        this.routes = [];
        this.mode = null;
        this.root = '/';
        return this;
    }

    check(fragment) {
        // Waar we naartoe willen, of waar we nu zijn
        fragment = fragment || this.getFragment()
        for (let route of this.routes) {
            let match = fragment.match(route.re)
            console.log(match)
            if (match) {
                match.shift()
                route.handler.apply({}, match)
                return this
            }
        }
        return this
    }

    listen() {
        /* Start de router, vanaf dit punt zal hij in haken op route verandering*/
        let self = this;
        let current = self.getFragment();
        var fn = function() {
                if (current !== self.getFragment()) {
                    current = self.getFragment();
                    self.check(current);
                }
            }
            // Fall back voor hash
        clearInterval(this.interval)
        this.interval = setInterval(fn, 500)
        return this
    }

    clearSlashes(path) {
        // Functie om een pad te cleanen
        return path.toString().replace(/\/$/, '').replace(/^\//, '')
    }
}