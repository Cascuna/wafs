function displaySpinner() {
    spinner = document.getElementById('spinner').classList.remove("hidden")
}

function hideSpinner() {
    spinner = document.getElementById('spinner').classList.add("hidden")
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Spatie naar -
        .replace(/[^\w\-]+/g, '')       // Verwijder alle niet woordchars
        .replace(/\-\-+/g, '-')         // Squish --++ naar -
        .replace(/^-+/, '')             // Trim - van de start
        .replace(/-+$/, '');            // Trim - van het einde
}

export {displaySpinner, hideSpinner}