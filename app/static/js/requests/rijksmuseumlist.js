import Request from './request.js';
export default class RijksmuseumListRequest extends Request {
    success(response){
        console.log(response)
        let listview = document.getElementById("rijksmuseum-listview")
        // let detailview = document.getElementById("rijksmuseum-detailview").innerHTML = ''
        if(listview.classList.contains('hidden')){
            listview.classList.remove('hidden')
            Request.prototype.success()
            return 
        }
        else{ 
        this.templateEngine.render('listview.html', {'objs': response}).then(renderedHtml => {            
            listview.innerHTML = "";
            listview.insertAdjacentHTML('beforeend', renderedHtml)
        }).catch(error => console.log(error))
        Request.prototype.success()
        }
    }
    cleanResponse(response){
        let artists = Object.values(response.facets[0]) 
        let rawArtObjects = Object.values(response.artObjects)
        let artObjectsWithImage = rawArtObjects.filter(obj => obj.hasImage == true)
        // Slugify de objecten. WIP
        // artObjectsWithImage.forEach(element => {
        //     element.slug = slugify(element.title)
        // });
        artObjectsWithImage.artists = artists[0].map(obj => obj = {url: encodeURI(obj.key), naam: obj.key})
        console.log(artObjectsWithImage)
        return artObjectsWithImage
    }

    getList(path){
        this.apiCacheHandler.setCurrentKey('rijksmuseumlist')
        this.send(path, 'ps=100')
    }
}