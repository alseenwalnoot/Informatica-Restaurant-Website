@echo off
setlocal

set ROOT=%~dp0
set SRC=%ROOT%react-frontend\src\components

echo Patching API URLs for production...
powershell -Command "(Get-Content '%SRC%\PaymentView.jsx' -Raw) -replace 'http://localhost:8000', 'http://localhost' | Set-Content '%SRC%\PaymentView.jsx'"
powershell -Command "(Get-Content '%SRC%\TrackView.jsx' -Raw) -replace 'http://localhost:8000', 'http://localhost' | Set-Content '%SRC%\TrackView.jsx'"
powershell -Command "(Get-Content '%SRC%\MenuView.jsx' -Raw) -replace 'http://localhost:8000', 'http://localhost' | Set-Content '%SRC%\MenuView.jsx'"

echo Building React...
cd "%ROOT%react-frontend"
call npm run build
cd "%ROOT%"

echo Restoring API URLs for local dev...
powershell -Command "(Get-Content '%SRC%\PaymentView.jsx' -Raw) -replace 'http://localhost/', 'http://localhost:8000/' | Set-Content '%SRC%\PaymentView.jsx'"
powershell -Command "(Get-Content '%SRC%\TrackView.jsx' -Raw) -replace 'http://localhost/', 'http://localhost:8000/' | Set-Content '%SRC%\TrackView.jsx'"
powershell -Command "(Get-Content '%SRC%\MenuView.jsx' -Raw) -replace 'http://localhost/', 'http://localhost:8000/' | Set-Content '%SRC%\MenuView.jsx'"

echo Assembling output...
if exist "%ROOT%dist-xampp" rmdir /s /q "%ROOT%dist-xampp"
mkdir "%ROOT%dist-xampp"

xcopy /e /i /y "%ROOT%php-backend" "%ROOT%dist-xampp"
xcopy /e /i /y "%ROOT%react-frontend\dist" "%ROOT%dist-xampp"

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