import Request from './request.js';
export default class ArtDetailRequest extends Request {
    success(request) {
        let jsonResponse = request
        jsonResponse = jsonResponse.artObject
        console.log(jsonResponse)
        let detailViewItem = this.templateEngine.render("detail.html", { 'obj': jsonResponse })
            .then(function(detailViewItem) {
                let detailview = document.getElementById("rijksmuseum-detailview")
                detailview.innerHTML = "";
                let listView = document.getElementById('rijksmuseum-listview').classList.add('hidden')
                detailview.insertAdjacentHTML('beforeend', detailViewItem)
            }).catch(error => console.log(error))
        Request.prototype.success()
    }

    fetchItem(path, iteminfo) {
        this.apiCacheHandler.setCurrentKey((iteminfo[0]))
        this.send(path + iteminfo[0])
    }
}