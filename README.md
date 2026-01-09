
# **[Prestige Opulent Website](https://walnutstudios.uk)**
## Voorwoord
Het is lastig om een react website met frontend en backend multiplatform te maken, ik heb dit wel gedaan, hij runt nu op linux EN windows, voor windows kan je de
releases/app.exe gebruiken (dubbelklikken vanuit de folder) (deze heb je gekregen in het zip bestandje), dit launcht de backend en frontend op http://localhost:8000

## **Windows port (compileren)**
### Stap 1 JavaScript
Download NodeJS van https://nodejs.org/en
Als het vraagt om extra dingen/tools, KLIK JA dit scheelt je zelf msvc installeren, want Node doet dit dan allemaal voor je

### Stap 2 SQLite
SQLite is nodig voor database handling en asio voor Crow's webserver handling,
installeer eerst vcpkg:
```
git clone https://github.com/microsoft/vcpkg 
cd vcpkg 
.\bootstrap-vcpkg.bat
```
dan asio en sqlite installeren:
```
.\vcpkg install sqlite3:x64-windows 
.\vcpkg install asio:x64-windows 
```
en als laatste vcpkg globaal maken:
```setx VCPKG_ROOT "PATH\TO\VCPKG"```
### Stap 2 C++ MSVC 
### (als je het niet heb gedaan bij NodeJS Installer)
Je zult Visual Studio Community moeten downloaden van
https://visualstudio.microsoft.com/
Tijdens het downloaded zul je MSVC C++ build tools ofz moeten verkrijgen

## **Linux port (compileren)**
### Stap 1 Alle dependencies downloaden
Doe '''make all''' in de folder van linux-cpp-backend en kijk voor de errors en download de benodigdheden
