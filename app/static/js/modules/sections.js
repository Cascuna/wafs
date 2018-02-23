export default class Sections {
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