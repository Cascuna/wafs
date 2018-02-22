export default class TemplateEngineObj{
    /*
    Eigen implementatie van een Template Engine.
    ondersteunt templatetags <% %> & complexere functies zoals if/for/else etc.
    */
    constructor(){
        // Singleton pattern
        // if (!templateEngineInstance) {
        //     templateEngineInstance = this;
        // }
        // else {
        //     return templateEngineInstance
        // }
        // Regex om op ALLE (/g) blocks die beginnen met <% en eindingen met %> te zoeken.
        this.dynamicBlockRegex = /<%([^%>]+)?%>/g
        // Functies welke niet gepusht moeten worden naar de array, maar gewoon uitgevoerd.
        this.escapeables = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g
        
        this.importTemplates = /(implements )(.*)?/g
        this.templateFolderPath = 'static/templates/'

        /* in deze lijst zit een array zodat we als string "lines.push()" hier aan kunnen appenden
        en javascript hier direct in kunnen toevoegen, en deze pas op het laatst pas te joinen.
        Hierdoor kun je bijv dingen doen als
        for(i of items){
            <li> <%i.naam%> <li>
        }
         */
        this.code = ['var lines=[];\n']
    }
        
    inherentTemplate(html){
        let fakethis = this
        this.templatedHtml = html
        this.iterations = 0
        return new Promise(function(resolve, reject){
            console.log('inherent', html.match(fakethis.importTemplates))
            fakethis.iterationsNeeded = html.match(fakethis.importTemplates).length
            for(let inherents of html.match(fakethis.importTemplates)){
                let inherentTemplate = inherents.substring(inherents.indexOf("(")+1, inherents.indexOf(")"))
                console.log('inner inherent', inherentTemplate)
                fakethis.loadTemplate(fakethis.templateFolderPath, inherentTemplate)
                .then((result) => {                
                    fakethis.templatedHtml = fakethis.templatedHtml.replace('<% implements ('+ inherentTemplate +') %>', result)
                    console.log(fakethis.templatedHtml)
                    fakethis.iterations++
                    console.log('iters',fakethis.iterations, fakethis.iterationsNeeded)
                    if(fakethis.iterationsNeeded === fakethis.iterations){
                        console.log('comes here')
                        resolve(fakethis.templatedHtml)
                        return fakethis.templatedHtml
                    }
                   
                })
            }
    
            

            // let templateName = html.substring(html.indexOf("(")+1, html.indexOf(")"))
            // fakethis.loadTemplate(fakethis.templateFolderPath, templateName)
            // .then((result) => {
            //     console.log()
            //     let templatedHtml = html.replace('<% implements ('+ templateName +') %>', result)
            //     console.log('bazinga', templatedHtml)

              

           
        })
        //     if(js && line.match(this.importTemplates)){
        //         console.log(line.match(this.importTemplates))
       
        //         console.log(templateName, this.template)
        //         if(templateName !== this.template){
        //             console.log('doe de woesh')
        //             this.render(String(templateName), this.context, true).then(result => {
        //                 console.log('dit ding doeneen woesh', result)
        //                 // console.log(result)
        //                 // this.content += result
        //                 // resolve(result)}).catch(error => console.log(error))
        //                 // console.log(templateName)
        //                 return result
        //             })  
        //         }
        //     }
        // })
    }


    loadTemplate(templateFolderPath, FilePath){
        /* Probeert de aangegeven template in het aangegeven templateFolderPad te vinden en uittelezen
        Deze manier van abstractie zorgt ervoor dat de Template niet in een code block hoeft te staan,
        en veel leesbaarder is. 
        TODO: Een fallback functie zou leuk zijn, aldus inline HTML als templates niet werken.*/
        let fakescope = this //solve met een bind
        return new Promise(function(resolve, reject){
            let absoluteTemplatePath = templateFolderPath + FilePath
            let request = new XMLHttpRequest()
            request.open("GET", absoluteTemplatePath)
            request.responseType = 'text'
            
            request.onload = function() {
                if(request.response.includes('implements')){
                    fakescope.inherentTemplate(String(request.response))
                    .then((html)=>{
                        console.log('dit is de resolved html', html)
                        resolve(html)
                        return html     
                    })
                }
                else{
                    resolve(request.response)
        }
            }
            request.error = function() {
                reject(request.status, String(request.response))
            }
            return request.send()    
        })
     }
 
    add(line, js){
        // return new Promise((resolve, rejected) =>{
        
           
        // Check of de lines tekens bevatten die in escapables voor komen,
        // zoja, append 'as is', anders push het in de lines array

        js ? this.code += line.match(this.escapeables) ? line + '\n' : 'lines.push(' + line + ');\n' : 
        this.code += 'lines.push("' + line.replace(/"/g, '\\"') + '");\n'
        return

            
    }

    render(template, context, recursiveCall = false){
        console.log(template)
        this.template = template
        console.log(recursiveCall)
        console.log('render wordt aangeroepen?!?!?')
        this.context = context 
        return new Promise((resolve, rejected) => {
            this.loadTemplate(this.templateFolderPath, template)
            .then((html) => {
                console.log('html contents', html)
                this.code = ['var lines=[];\n']
            
                // Gevonden <% %> block
                let match 
                // Cursor om onze positie in de HTML te bepalen
                let cursor = 0
                let resultaten = []
                while(match = this.dynamicBlockRegex.exec(html)) {
                    // Hier gebruik ik html.slice met ded cursor & match index zodat niet elke keer de hele html
                    // toegevoegd wordt
                    this.add(html.slice(cursor, match.index))
                    this.add(match[1], true)
                    cursor = match.index + match[0].length;
                }

                // Voeg de resterende HTML toe
                this.add(html.substr(cursor, html.length - cursor))
                if(!recursiveCall){
                    this.code += 'return lines.join("");';
                    
                    // We gebruiken hier .apply zodat de scope van het script automatisch geset wordt, en
                    // we dus this.name etc kunneng ebruiken. Op deze manier hebben we geen params nodig.
                    // return new Promise((resolve, reject) => {
                    const runPreparedCode = Function(this.code.replace(/[\r\t\n]/g, ''))
                    let result = runPreparedCode.apply(context)
                    resolve(result)
                } else {
                    console.log('enters this')
                    let toReturn = this.code.replace('var lines=[];', '')
                    console.log(toReturn)
                    resolve(toReturn)
                }
            }).catch(error => console.log(error))
        })
    }
}