
import RijksmuseumListRequest from './requests/rijksmuseumlist.js';
import RijksmuseumArtistListRequest from './requests/rijksmuseumpainterlistrequest.js';
import RijksmuseumItemRequest from './requests/rijksmuseumitem.js';
import RijksmuseumPainterRequest from './requests/rijksmuseumpainter.js';
import Sections from './sections.js';
import Router from './router.js';



/* Code is geschreven in ES6, blocks geven hetzelfde effect als het iffes pattern
   Aldus, de klasses zijn niet direct via het window object te vinden.
*/

{
    let templateEngineInstance;


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
                router.add(/detail_view\/schilder\/(.*)/, function() {
                    let rijskmuseumitem = new RijksmuseumPainterRequest()
                    rijskmuseumitem.getPainterList('collection', arguments)
                })
                router.add(/detail_view\/(.*)/, function() {
                    let rijskmuseumitem = new RijksmuseumItemRequest()
                    rijskmuseumitem.getItem('collection/', arguments)
                })
               
                router.add(/objecten_catalogus/, function() {
                    let rijksmuseum = new RijksmuseumListRequest()
                    rijksmuseum.getList('collection')
                })
                router.add(/schilder_catalogus/, function() {
                    let rijksmuseum = new RijksmuseumArtistListRequest()
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
  
    // Maak het app object pas aan als alle domcontent geladen is, zodat we de <section>'s kunnen zien.
    window.addEventListener("DOMContentLoaded", function() {
        const app = new App()
    })
}