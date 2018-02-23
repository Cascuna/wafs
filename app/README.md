# De wafs applicatie, rijksmuseum editie.
Deze applicatie is ontwikkeld voor het vak WaFS van de minor web development te HVA.
![Alt text][homepage]

## Wat doet de applicatie?
De applicatie is bedoelt als kunst navigatie applicatie, de gebruiker kan door de laatst toegevoegde kunstwerken van het rijksmuseum bladeren, of zijn favorieten kunstenaar zijn kunstwerken bekijken. De applicatie is op het moment van publicatie niet klaar voor productie, en mag ook niet in productie omgevingen gebruikt worden.

## Dependencies
In de applicatie is een mix van es5 & es6 gebruikt  
es6 is hier leidend, maar sommige syntaxtic sugar componenten begreep ik nog niet volledig in es5, en heb deze dus in es5 geschreven  
  
* De content van de applicatie is erg afhankelijk van de http://rijksmuseum.github.io  
Voor de rest gebruikt de applicatie een TemplateEngine & Router welke beide zelf geschreven zijn in de atijl van dit project  

## Architecturele keuzes
Het project is opgezet met de gedachten om het 'classen' systeem van ES6 beter te leren kennen, gezamenlijk met de onderliggende architecturele keuzes van Javascript.  
Met het implementeren van deze classes heb ik een leuke usecase voor deze classes gevonden, het **request** object. Het is zo opgezet dat er specificaties van het object gemaakt kunnen worden, welke specifiekere implementaties kunnen aangeven voor **hoe** hun data gerenderd en opgeschoond moet worden.  
Verder heb ik gekozen om binnen de template engine **promises** te gebruiken, voor het laden van de bestand templates & het overerven. In het template engine zit een lichte adaptatie van het *composite* design pattern, alleen is deze door restricites (tijd & gebrek aan diepe javascript kennis) niet compleet geimplementeerd.  
Binnen de applicatie is ook gul gebruik gemaakt van het Singleton design pattern, om te garanderen dat objecten niet vaker geinstantieerd worden dan nodig.   

het Request object staat hier centraal, dit is waar alle api calls op leunen

## Features waar ik erg trots op ben
* Overerving binnen de template engine
* De template engine in het algemeen (de functionaliteit niet de code, dit kan beter)
* Het request Object

## Features waar ik minder trots op ben
* De template engine is niet getest, maar is wel erg complex. Dit had voor mijn gevoel beter gekund 
* Dat alles in een Class gewrapt is, is vrij overbodig achteraf gezien
* Wellicht is het testen van het Request object nodig, aangezien dit het belangerijkst is

## Toekomstige plannen
- [ ] - Het stroomlijnen van de template engine, ervoor zorgen dat inheritance cascaded
- [ ] - De code opschonen en onderhoudbaarder maken door verdere decoupleing en het gebruik van mix-ins
- [ ] - Tests voor de meest complexe delen van de code

## Flowchart
Note; omdat mijn code erg generiek is opgezet vind ik een flowchart voor de verschillende requests overbodig
![alt text][flowchart]

## Classdiagram
![alt text][classdiagram]



[flowchart]: https://github.com/Cascuna/wafs/blob/master/app/static/img/flowchart-wafs.png "Flowchart"
[classdiagram]: https://github.com/Cascuna/wafs/blob/master/app/static/img/wafs-uml-diagram.png "Classdiagram"
[homepage]: https://github.com/Cascuna/wafs/blob/master/app/static/img/homepage.png "Homepage"
