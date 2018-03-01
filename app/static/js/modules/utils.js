function displaySpinner() {
    spinner = document.getElementById('spinner').classList.remove("hidden")
}

function hideSpinner() {
    spinner = document.getElementById('spinner').classList.add("hidden")
}

function renderSection(sectionId, renderedHtml){
    let activeSection = document.getElementById(sectionId)
    activeSection.classList.remove("hidden")
    activeSection.innerHTML = ''
    activeSection.insertAdjacentHTML("beforeend", renderedHtml)
    return activeSection 
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Spatie naar -
        .replace(/[^\w\-]+/g, '')       // Verwijder alle niet woordchars
        .replace(/\-\-+/g, '-')         // Squish --++ naar -
        .replace(/^-+/, '')             // Trim - van de start
        .replace(/-+$/, '');            // Trim - van het einde
}

function hookListener(idName) {
    let searchbar = document.getElementById('art-search-bar')
    console.log('searchbar', searchbar)
    searchbar.addEventListener("keyup", event => {
        let innerList = document.getElementById(idName)
        console.log(innerList)
        let innerListItems = [...innerList.querySelectorAll('li')]
        innerListItems.filter((li) => {
            if(li.innerHTML.toLowerCase().indexOf(searchbar.value.toLowerCase()) <= -1){
                li.classList.add('hidden')
            }
            else{
                li.classList.remove('hidden')
            }
        })
    })
}

export {displaySpinner, hideSpinner, hookListener, renderSection}