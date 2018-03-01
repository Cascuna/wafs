let sectionInstance = ''
export default class Sections {
    constructor() {
       if(!sectionInstance){
           sectionInstance = this
       }
       else {
           return sectionInstance
       }
       this.nav = document.querySelector("nav ul")
       this.sections = this.retrieveSections()
       this.fillNavBar()
   }

   toggle(hash){
       console.log(hash)
       for(let section of this.sections){
           console.log('this is the hash', hash, 'this is the section.id', section.id)
           hash = hash.split("/")[0]
           if(section.id != hash){
               console.log(hash, 'not equal to each other')
               document.getElementById(section.id).classList.add("hidden")
           }
           else{
            console.log('equal')
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