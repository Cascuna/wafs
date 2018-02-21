function displaySpinner() {
    spinner = document.getElementById('spinner').classList.remove("hidden")
}

function hideSpinner() {
    spinner = document.getElementById('spinner').classList.add("hidden")
}

export {displaySpinner, hideSpinner}