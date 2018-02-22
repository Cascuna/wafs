export default class ApiCacheHandler {
    constructor(key){
        this.setCurrentKey(key)
    }

    setCurrentKey(key){
        this.key = key
    }

    cacheData(key, value){
        // Make a new CacheData entry
        console.log('value', JSON.stringify(value.artists))
        let entryToCache = {value: value, timestamp: new Date().getTime()}
        localStorage.setItem(key, JSON.stringify(entryToCache))
        return JSON.parse(localStorage.getItem(key)).value
    }
    
    compareTime(cacheDate, now){
        let day =  86000000 // Day in ms 
        return now - cacheDate <= day ? true : false  
    }

    retrieveCachedItems(key){
        console.log(key)
        try {
            let object = JSON.parse(localStorage.getItem(key))
            console.log(object.value)
            
            let cacheTimestamp = object.timestamp
            let nowTimestamp = new Date().getTime().toString()
            console.log('Cache entry is valid', this.compareTime(cacheTimestamp, nowTimestamp))
            if(!navigator.onLine) {
                return object.value
            }
            console.log(this.compareTime(cacheTimestamp, nowTimestamp))
            return this.compareTime(cacheTimestamp, nowTimestamp) ? object.value : false 

        }
        catch {
            return false 
        }
    }
}