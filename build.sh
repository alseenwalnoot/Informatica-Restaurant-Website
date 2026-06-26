#!/bin/bash
set -e

echo "Building React..."
cd react-frontend
npm run build
cd ..

echo "Assembling output..."
rm -rf dist-xampp
mkdir dist-xampp

# PHP backend at root
cp -r php-backend/* dist-xampp/

# React build into root (XAMPP serves index.html)
cp -r react-frontend/dist/* dist-xampp/

echo "Done. Drop dist-xampp/ contents into XAMPP htdocs/"