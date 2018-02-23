export default class TemplateEngine {
    /*
    Eigen implementatie van een Template Engine.
    ondersteunt templatetags <% %> & complexere functies zoals if/for/else etc.
    */
    constructor() {
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
        this.templateFolderPath = 'templates/'

        /* in deze lijst zit een array zodat we als string "lines.push()" hier aan kunnen appenden
        en javascript hier direct in kunnen toevoegen, en deze pas op het laatst pas te joinen.
        Hierdoor kun je bijv dingen doen als
        for(i of items){
            <li> <%i.naam%> <li>
        }
         */
        this.code = ['var lines=[];\n']
    }

    inheritTemplate(html) {
        /*
        Loopt door de HTML heen en kijkt of er implements tags in staan. Aan de hand van deze tags
        wordt de desbetreffende template ingeladen, en de HTML in de originele aanroepende template gestopt. 
        */
        const fakethis = this
        let templatedHtml = html
        let iterations = 0
        return new Promise(function(resolve, reject) {
            const iterationsNeeded = html.match(fakethis.importTemplates).length
            for (let inherents of html.match(fakethis.importTemplates)) {

                let inherentTemplate = inherents.substring(inherents.indexOf("(") + 1, inherents.indexOf(")")) // Vekrijg alleen de templatenaam (bijv index.html)
                fakethis.loadTemplate(fakethis.templateFolderPath, inherentTemplate)
                    .then((result) => {
                        templatedHtml = templatedHtml.replace('<% implements (' + inherentTemplate + ') %>', result)
                        iterations++
                        if (iterations === iterationsNeeded) {
                            resolve(templatedHtml)
                            return templatedHtml
                        }
                    })
            }
        })
    }


    loadTemplate(templateFolderPath, filePath) {
        /* Probeert de aangegeven template in het aangegeven templateFolderPad te vinden en uittelezen
        Deze manier van abstractie zorgt ervoor dat de Template niet in een code block hoeft te staan,
        en veel leesbaarder is.  */
        const fakescope = this //solve met een bind ?
        return new Promise(function(resolve, reject) {
            let absoluteTemplatePath = templateFolderPath + filePath
            let request = new XMLHttpRequest()
            request.open("GET", absoluteTemplatePath)
            request.responseType = 'text'

            request.onload = function() {
                if (request.response.includes('implements')) {
                    fakescope.inheritTemplate(String(request.response))
                        .then((html) => {
                            resolve(html)
                            return html
                        })
                } else { resolve(request.response) }
            }

            request.error = function() {
                reject(request.status, String(request.response))
            }
            return request.send()
        })
    }

    add(line, js) {

        // Check of de lines tekens bevatten die in escapables voor komen,
        // zoja, append 'as is', anders push het in de lines array
        js ? this.code += line.match(this.escapeables) ? line + '\n' : 'lines.push(' + line + ');\n' :
            this.code += 'lines.push("' + line.replace(/"/g, '\\"') + '");\n'
        return


    }

    render(template, context) {
        this.template = template
        this.context = context
        return new Promise((resolve, rejected) => {
            this.loadTemplate(this.templateFolderPath, template)
                .then((html) => {
                    this.code = ['var lines=[];\n']
                        // Gevonden <% %> block
                    let match
                        // Cursor om onze positie in de HTML te bepalen
                    let cursor = 0
                    let resultaten = []
                    while (match = this.dynamicBlockRegex.exec(html)) {
                        // Hier gebruik ik html.slice met ded cursor & match index zodat niet elke keer de hele html
                        // toegevoegd wordt
                        this.add(html.slice(cursor, match.index))
                        this.add(match[1], true)
                        cursor = match.index + match[0].length;
                    }

                    // Voeg de resterende HTML toe
                    this.add(html.substr(cursor, html.length - cursor))
                    this.code += 'return lines.join("");';
                    // We gebruiken hier .apply zodat de scope van het script automatisch geset wordt, en
                    // we dus this.name etc kunneng ebruiken. Op deze manier hebben we geen params nodig.
                    // return new Promise((resolve, reject) => {
                    const runPreparedCode = Function(this.code.replace(/[\r\t\n]/g, ''))
                    let result = runPreparedCode.apply(context)
                    resolve(result)

                }).catch(error => console.log(error))
        })
    }
}