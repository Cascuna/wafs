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
            // De call naar de toggle functie is in een functie gewrapt, zodat de
            // scope die meegeven wordt niet 'hashchanged' is. 
            window.addEventListener("hashchange", function(event){
                self.sections.toggle(location.hash.replace(/^#/, ""))
            });
        }
    }

    // Maak het app object pas aan als alle domcontent geladen is, zodat we de <section>'s kunnen zien.
    window.addEventListener("DOMContentLoaded", function() {
        const app = new App()
    })
}