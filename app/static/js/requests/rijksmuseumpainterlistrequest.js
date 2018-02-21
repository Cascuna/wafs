import Request from './request.js';
export default class RijksmuseumArtistListRequest extends Request {
    success(response){
        console.log(response)
        let listview = document.getElementById("rijksmuseum-painterview")
        // let detailview = document.getElementById("rijksmuseum-detailview").innerHTML = ''
        this.templateEngine.render('artistlistview.html', {'objs': response}).then(renderedHtml => {            
            listview.innerHTML = "";
            listview.insertAdjacentHTML('beforeend', renderedHtml)
        }).catch(error => console.log(error))
        Request.prototype.success()
        
    }
    cleanResponse(response){
        let artists = Object.values(response.facets[0]) 
        artists = artists[0].map(obj => obj = {url: encodeURI(obj.key), naam: obj.key})
        console.log(artists)
        return artists
    }

    getList(path){
        this.apiCacheHandler.setCurrentKey('rijksmuseumartistlist')
        this.send(path, 'ps=100')
    }
}