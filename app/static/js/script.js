// Code is geschreven in ES6, aldus blocks ipv iffeś
'use strict'
{
    class App{
        constructor() {
            this.routes = new Routes()
            this.init()
        }

        init(){
            console.log("Ik ben geinitaliseerd!")
        }
    }

    class Sections{
        constructor() {
            
            this.constructNavBar()
            //TODO: Implementatie volgt
        }

        toggle(event){
            console.log(event)
        }

        retrieveSections(){
            // Verliest de link naar de dom, dit is de reden dat mensen getElementById gebruiken
            return document.querySelectorAll("section")    
        }

        createNavItem(section){
            let nav = document.querySelector("nav ul")
            let li = document.createElement("li")
            li.id = section
            
            let anchor = document.createElement("a")
            anchor.href = "#" + section
            anchor.innerText = section

            li.appendChild(anchor)
            nav.appendChild(li)
            console.log(nav)
        }

        constructNavBar(){
            for(let section of this.retrieveSections()){
                console.log(section.id)
                this.createNavItem(section.id)
            }
        }

    }

    class Routes{
        constructor() {
            this.sections = new Sections()
            this.init()
            //TODO: Implementatie volgt
        }
//  function() {this.sections.toggle}
        init(){
            self = this;
            window.addEventListener("hashchange", function(event){
                self.sections.toggle(location.hash)
            });
        }
    }

    window.addEventListener("DOMContentLoaded", function() {
        const app = new App()
    })
}