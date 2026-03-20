rm -rf build
mkdir build
cd build
cmake ..
make
cd ../../react-frontend
npm run build 
cd ../cppbackend/build
mkdir -p templates
ln -s ../../../react-frontend/dist templates/dist
cd ..