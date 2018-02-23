import Request from './request.js';
import { hookListener } from '../utils.js';
export default class ArtListRequest extends Request {
    success(response) {
        let listview = document.getElementById("rijksmuseum-listview")
        let detailview = document.getElementById("rijksmuseum-detailview")
            // Dit is een beetje vies, maar voorkomt het moeten ophalen van items uit de cache OF api
        if (listview.classList.contains('hidden')) {
            detailview.innerHTML = ''
            listview.classList.remove('hidden')
            Request.prototype.success()
            return
        } else {
            this.templateEngine.render('listview.html', { 'objs': response })
                .then(renderedHtml => {
                    detailview.innerHTML = ""
                    listview.innerHTML = ""
                    listview.insertAdjacentHTML('beforeend', renderedHtml)
                    hookListener('rijksmuseum-listview')
                }).catch(error => console.log(error))

            Request.prototype.success()

        }
    }

    reformatResponse(response) {
        // Zorg ervoor dat alleen artikelen met fotos in de lijst komen, 
        let rawArtObjects = Object.values(response.artObjects)
        let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)
        return artObjectsWithImage
    }

    fetchList(path) {
        this.apiCacheHandler.setCurrentKey('rijksmuseumlist')
        this.send(path, 'ps=100')
    }
}