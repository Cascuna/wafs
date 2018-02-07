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
            this.nav = document.querySelector("nav ul")
            this.sections = this.retrieveSections()
            this.constructNavBar()
            //TODO: Implementatie volgt
        }

        toggle(hash){
            console.log(hash)
            for(let section of this.sections){
                if(section.id != hash){
                    document.getElementById(section.id).classList.add("hidden");
                } 
            }
        }

        retrieveSections(){
            // Verliest de link naar de dom, dit is de reden dat mensen getElementById gebruiken
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

        constructNavBar(){
            for(let section of this.sections){
                console.log(section.id)
                this.createNavItem(section.id)
            }
        }

    }

    class Routes    {
        constructor() {
            this.sections = new Sections()
            this.init()
            //TODO: Implementatie volgt
        }
//  function() {this.sections.toggle}
        init(){
            self = this;
            window.addEventListener("hashchange", function(event){
                self.sections.toggle(location.hash.replace(/^#/, ""))
            });
        }
    }

    window.addEventListener("DOMContentLoaded", function() {
        const app = new App()
    })
}