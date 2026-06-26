@echo off
setlocal

set ROOT=%~dp0
set SRC=%ROOT%react-frontend\src\components

echo Building React...
cd "%ROOT%react-frontend"
call npm run build
cd "%ROOT%"

echo Assembling output...
if exist "%ROOT%dist-xampp" rmdir /s /q "%ROOT%dist-xampp"
mkdir "%ROOT%dist-xampp"

xcopy /e /i /y "%ROOT%php-backend" "%ROOT%dist-xampp"
xcopy /e /i /y "%ROOT%react-frontend\dist" "%ROOT%dist-xampp"
xcopy /e /i /y "%ROOT%react-frontend\node_modules\leaflet\dist\images" "%ROOT%dist-xampp\images"

(
echo ^<IfModule mod_rewrite.c^>
echo   RewriteEngine On
echo   RewriteBase /
echo   RewriteRule ^index\.html$ - [L]
echo   RewriteCond %%{REQUEST_FILENAME} !-f
echo   RewriteCond %%{REQUEST_FILENAME} !-d
echo   RewriteRule . /index.html [L]
echo ^</IfModule^>
) > "%ROOT%dist-xampp\.htaccess"

echo.
echo Done! Copy contents of dist-xampp\ into XAMPP htdocs\
pause