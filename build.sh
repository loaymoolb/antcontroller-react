REACT_APP_DEVICE_ADDR="" npm run build

(cd build/static/js; gzip *.map)

tar -czf build.tar.gz build