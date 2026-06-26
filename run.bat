@echo off
setlocal
cd /d "%~dp0"
echo Omdat php nog enigzinds oke is en xampp uit de kelder van hell komt.
echo Looking for PHP...

:: Search common XAMPP locations
set PHP=
for %%D in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist "%%D:\xampp\php\php.exe" set PHP=%%D:\xampp\php\php.exe
    if exist "%%D:\XAMPP\php\php.exe" set PHP=%%D:\XAMPP\php\php.exe
)

:: Also check Program Files
if not defined PHP (
    if exist "C:\Program Files\xampp\php\php.exe" set PHP=C:\Program Files\xampp\php\php.exe
)

if not defined PHP (
    echo Could not find XAMPP. Please install XAMPP or put php.exe in your PATH.
    pause
    exit /b 1
)

echo Found PHP at: %PHP%

:: Find php.ini
for %%F in ("%PHP%") do set PHPDIR=%%~dpF
set INI=%PHPDIR%php.ini
if not exist "%INI%" set INI=%PHPDIR%php.ini-development
if not exist "%INI%" (
    echo Could not find php.ini, skipping extension check.
    goto START
)

:: Enable curl if not already
powershell -Command "(Get-Content '%INI%' -Raw) -replace ';extension=curl', 'extension=curl' | Set-Content '%INI%'"
:: Enable sqlite3 if not already  
powershell -Command "(Get-Content '%INI%' -Raw) -replace ';extension=sqlite3', 'extension=sqlite3' | Set-Content '%INI%'"

echo Extensions enabled.

:START
echo Starting Prestige Opulent at http://localhost:8000
start http://localhost:8000
"%PHP%" -S localhost:8000 -t dist-xampp dist-xampp\router.php
pause