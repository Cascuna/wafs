import Request from './request.js';
import { hookListener } from '../utils.js';
export default class ArtistDetailListRequest extends Request {
    success(request) {
        let jsonResponse = request
        let detailViewItem = this.templateEngine.render("listview-painter.html", { 'objs': jsonResponse })
            .then(renderedHtml => {
                let detailView = document.getElementById("rijksmuseum-detailview")
                detailView.innerHTML = "";
                detailView.insertAdjacentHTML('beforeend', renderedHtml)
                hookListener('rijksmuseum-detailview')
            }).catch(error => console.log(error))
        Request.prototype.success()
    }

    reformatResponse(response) {
        let artists = Object.values(response.facets[0])
        let rawArtObjects = Object.values(response.artObjects)
        let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)

        artObjectsWithImage.artist = this.extraSettings.split('=')[1]
        return artObjectsWithImage
    }

    fetchPainterList(path, painterName) {
        this.apiCacheHandler.setCurrentKey((painterName[0]))
        let painter = decodeURI(painterName[0])
        this.send(path, 'involvedMaker=' + painter)
    }
}