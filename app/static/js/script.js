import ArtListRequest from './modules/requests/rijksmuseumlist.js';
import ArtistListRequest from './modules/requests/rijksmuseumpainterlist.js';
import ArtDetailRequest from './modules/requests/rijksmuseumitem.js';
import ArtistDetailListRequest from './modules/requests/rijksmuseumpainter.js';
import Sections from './modules/sections.js';
import Router from './modules/router.js';



/* Code is geschreven in ES6, blocks geven hetzelfde effect als het iffes pattern
   Aldus, de klasses zijn niet direct via het window object te vinden.
*/

{
    let templateEngineInstance;
    /* het keywoord class hier is syntaxic sugar voor een Constructor Function.
    Dit is dan ook de reden dat een constructor() verplicht is binnen klasses.

    Het object wordt nog steeds aangemaakt aan de hand van prototype inheritance, 
    ook functies worden nog steeds als properties gebonden.

    */
    let appInstance;
    class App {

        constructor() {
            // Singleton principe, zorgt ervoor dat er maximaal 1 app instantie kan leven.
            if (!appInstance) {
                appInstance = this;
            } else {
                return appInstance
            }
            this.router = new Router()
            this.router.config({ mode: 'hash' })
            this.defineAppPaths(this.router)
            this.router.check()
        }

        defineAppPaths(router) {
            // Stel de paden in waar naartoe geroute kan worden
            try {
                router.add(/detail_view\/schilder\/(.*)/, function() {
                    let rijskmuseumitem = new ArtistDetailListRequest()
                    rijskmuseumitem.fetchPainterList('collection', arguments)
                })
                router.add(/detail_view\/(.*)/, function() {
                    let rijskmuseumitem = new ArtDetailRequest()
                    rijskmuseumitem.fetchItem('collection/', arguments)
                })

                router.add(/objecten_catalogus/, function() {
                    let rijksmuseum = new ArtListRequest()
                    rijksmuseum.fetchList('collection')
                })
                router.add(/schilder_catalogus/, function() {
                    let rijksmuseum = new ArtistListRequest()
                    rijksmuseum.getList('collection')
                }).listen()
            } catch {
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
    const app = new App()
}