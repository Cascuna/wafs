import Request from './request.js';
export default class RijksmuseumPainterRequest extends Request {
    success(request){
        let jsonResponse = request
        console.log('dit is de painter request', jsonResponse)
        let detailViewItem = this.templateEngine.render("listview-painter.html", {'objs': jsonResponse})
        .then(renderedHtml => {
            let listview = document.getElementById("rijksmuseum-detailview")
            listview.innerHTML = "";
            listview.insertAdjacentHTML('beforeend', renderedHtml)
        }).catch(error => console.log(error))
        Request.prototype.success()
    }

    cleanResponse(response){
        let artists = Object.values(response.facets[0])
        // console.log(artists)
        let rawArtObjects = Object.values(response.artObjects)
        let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)
        // Slugify de objecten. WIP
        // artObjectsWithImage.forEach(element => {
        //     element.slug = slugify(element.title)
        // });
        
        artObjectsWithImage.artist = this.extraSettings.split('=')[1]
        console.log(artObjectsWithImage)
        return artObjectsWithImage
    }

    getPainterList(path, painterName){
        console.log(painterName)
        this.apiCacheHandler.setCurrentKey((painterName[0]))
        console.log(decodeURI(painterName[0]))
        let painter = decodeURI(painterName[0])
        this.send(path, 'involvedMaker=' + painter)
    }
}