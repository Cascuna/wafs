import Request from './request.js';
import { hookListener } from '../utils.js';

export default class ArtistListRequest extends Request {
    success(response) {
        let listview = document.getElementById("rijksmuseum-painterview")
        this.templateEngine.render('artistlistview.html', { 'objs': response }).then(renderedHtml => {
            listview.innerHTML = "";
            listview.insertAdjacentHTML('beforeend', renderedHtml)
            let detailview = document.getElementById("rijksmuseum-detailview")
            detailview.innerHTML = "";
            hookListener('rijksmuseum-painterview')

        }).catch(error => console.log(error))
        Request.prototype.success()
    }

    reformatResponse(response) {
        let artists = Object.values(response.facets[0])
        artists = artists[0].map(obj => obj = { url: encodeURI(obj.key), naam: obj.key })
        console.log(artists)
        return artists
    }

    getList(path) {
        this.apiCacheHandler.setCurrentKey('rijksmuseumartistlist')
        this.send(path, 'ps=100')
    }
}