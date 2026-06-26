
# **[Prestige Opulent Website](https://walnutstudios.uk)**
## Voorwoord
Nooit. Meer. PHP.
Het is niet eens PHP zelf, het is oud, tuurlijk maar werkt nog. Maar XAMPP??? Mijn C++ backend was zoveel beter op elke manier in elke richting dan ook.

Met zelf runnen werkt de website, maar zul je niet de tracking functionaliteit kunnen gebruiken (Die links gaan namelijk naar de gedeployde versie, en als je een order aanmaakt zal die natuurlijk niet ineens op mijn server verschijnen). Het mailsysteem zal wel werken sinds de php backend gewoon mijn mailservers aantikt. Voor de volledige functionaliteit en stabiliteit is het gewoon makkelijker om de gedeployde stabiele versie te gebruiken.

Sinds deze hele website vrijwel gewoon echt is behalve dat het restaurant niet bestaat, wil ik je ook vragen om echte data in te voeren. (Dus niet mrincredible@coolemail.com maar gewoon g.lodder@spieringshoek.nl ofzo. En geen 6767EE als postcode maar gewoon een echte. (ook een echte locatie) sinds je dan een mail krijgt met tracking en dergelijken.

## Runnen
Om de site zelf te runnen doe je ```git clone -b windows --single-branch https://github.com/alseenwalnoot/Informatica-Restaurant-Website.git```
Dan doe je gewoon ```run.bat``` vanuit de project root. (dus niet zelf gaan spelen met xampp, dat hoeft niet).
De website zal starten op ```localhost:8000```. 

## Notities
Het is genuinely terrible om servered websites te runnen op windows. Laat staan bouwen.
Om de website te compileren naar ```dist-xampp\``` moet je de Node Package Manager geinstalleerd hebben op je computer (npm), dan doe je ```cd react-frontend\``` en dan ```npm install```. 
Vervolgens doe je ```cd ..``` en ```build.bat``` (hier staan mogelijk incorrecte instructies), en dan is de website gecompileerd.

In het geval dat ```run.bat``` klaagt over php extensies die niet aanstaan, moet je toch in xampp's Apache configs (php.ini) de php-curl extensie en php-sqlite aanzetten (je uncomment dus ```extension=curl``` en ```extension=sqlite3```).
Verderest hoef je xampp niet aan te raken.