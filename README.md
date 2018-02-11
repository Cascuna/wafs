# BELANGERIJK
Voor mijn code reviews heb ik issues gebruikt, omdat ik het fijner vind om mensen kennis te geven over wat ze beter kunnen doen door middel van issues, ipv de code aan te passen. Dan lopen ze namenlijk het risico dat ze er niet ckritisch naar kijken.
Ik heb bas en Vincent een code review gegeven.
# wafs
The course repo for 'Web App From Scratch'

## Voordelen en nadelen van Javascript Frameworks & Libraries
## Wat zijn Frameworks & Libraries 

**Framework**  
Een framework is een pakket waar je meestal je gehele applicatie op basseert en je architectuur naar modelleert. 
Kenmerkend is hier vaak dat er veel verschillende lagen van abstractie binnen het Framework zelf zijn

**Library**   
Een set aan functies welke je kan gebruiken, zodat je deze functies zelf niet hoeft te schrijven.


## Voordelen en Nadelen

### Voordelen

* Beide versnellen de ontwikkeling van producten. Frameworks bieden veel kern componenten nodig voor een applicatie, welke goed gemodeleert zijn en ontworpen met o.a. design patterns etc. Libraries bieden hier kant & klare oplossingen voor veel voorkomende functionaliteiten aan.
* Omdat Frameworks & Libraries vaak opensource ontwikkeld worden is de kans groter dat de beveiliging wel op orde is. 100de mensen evauleren de coden en zullen dus sneller exploits zien en oplossen.
* De meeste frameworks & libraries komen met documentatie, support of een grote gemeenschap erom heen waardoor je vaak veel informatie kan winnen.
* Kosten kunnen lager zijn, omdat je geen tijd hoeft te besteden aan het leren van alle implementaties die al in het framework/library zitten.
### Nadelen 
* Door veel componenten & functies aan te bieden, stijgt de abstractie. De ontwikkelaar hoeft zich niet meer met de implementatie te bemoeien, en weet dus niet precies hoe het geen wat hij gebruikt werkt.
* De abstractie kan al helemaal problematisch zijn als implementaties aangepast moeten worden om aan de eisen van een klant te voldoen, in het ergste geval zou het framework geforkt moeten worden, waardoor updates lastiger te intergreren kunnen worden.
* Door de grote hoeveelheid Javascript libraries & Frameworks, kan het voorkomen dat je keuze voor het product na een jaar al niet meer relevant is, en snel als een legacy product zal worden gezien.
* Frameworks & Libraries worden veel gebruikt, waardoor exploits vrij snel verspreid worden. Snel updaten is dus soms een must, maar updates kunnen ook functies deprecaten, wat mogelijk tot problemen kan leveren. 
* Je leert het framework of de library kennen, maar niet daadwerkelijk Javascript. Als gevolg hiervan zou je alsnog moeite kunnen hebben met deze functies zelf implementeren zonder framework/library.
* Vendor lock-in, als je een framework oppakt wordt je vrijwel geforceert om het op het manier van het framework te doen, wat je erg kan limiteren.

## Advantages and disadvantages of client-side single page web apps
## Inleiding
Een single page application is een applicatie waarbij er geen pagina refreshes nodig zijn om door de website te navigeren. Websites die dit gebruiken zijn bijvoorbeeld Github, Youtube etc.
De 1 pagina ervaring wordt bereikt door het inladen van de content via Javascript, een grote dependency van deze applicaties.

## Voordelen en nadelen

### Voordelen
* De applicaties kunnen sneller zijn omdat de HTML, css & javascript bestanden slecht eenmalig geladen hoeft te worden gedurende de executie tijd van de applicatie.
* Het maar eenmaling binnen halen van HTML, CSS & Javascript maakt caching heel effectief.
* Het omzetten van de web applicatie naar een native applicatie is eenvoudiger, omdat de ontwikkelaar codekan herbruiken van de applicatie.
### Nadelen
* De initiele download van HTML, CSS & JavaScript is langzamer.
* De data van de applicatie wordt vaak via Ajax opgehaald vanuit de backend. Dit zorgt ervoor dat SEO regelen vanuit de front-end een stuk lastiger heb
* SPA's zijn gevoeliger voor XSS (CrossSite Scripting), reden hiervoor is omdat aanvallers via de homepagian de client-side scripts in de applicatie kunnen injecteren.

## Best practices
(van de sheets)
* Don't use global variables/objects
* Declare variables at top of scope
* Use short clear meaningful names (English)
* Work in strict mode
* camelCase your code if(code != Constructor || CONSTANTS)
* Place external scripts at the bottom of the page
* Indent your code
* Always code comment  
(Eigen best practices)
* Always explain syntactic sugar in your personal projects to force yourself to think critically about the problem the sugar tackles
* Adhere to the SRP principle
* Adhere to the DRY principle
* Try to always keep your code explicit, leave magic to wizards
* Don't focus on optimilisation untill you need to

https://github.com/airbnb/javascript


