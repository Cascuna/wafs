export default class ApiCacheHandler {
    /* 
    Object verantwoordelijk voor alle interactie tussen een RequestObject & de LocalStorage
    */
    constructor(key) {
        this.setCurrentKey(key)
    }

    setCurrentKey(key) {
        this.key = key
    }

    writeToCache(key, value) {
        let entryToCache = { value: value, timestamp: new Date().getTime() }
        localStorage.setItem(key, JSON.stringify(entryToCache))
        return JSON.parse(localStorage.getItem(key)).value
    }

    compareTime(cacheDate, now) {
        /* Functie om te bepalen of de items in de cache vervangen moeten worden */
        let day = 86000000 // Dag in ms
        return now - cacheDate <= day ? true : false
    }

    retrieveCachedItems(key) {
        try {
            let object = JSON.parse(localStorage.getItem(key))

            let cacheTimestamp = object.timestamp
            let nowTimestamp = new Date().getTime().toString()
            if (!navigator.onLine) {
                // Stuur altijd de cache terug als de gebruiker offline is
                return object.value
            }
            return this.compareTime(cacheTimestamp, nowTimestamp) ? object.value : false

        } catch {
            return false
        }
    }
}