REACT_APP_DEVICE_ADDR="" npm run build

(cd build/static/js; gzip *.map)
rm -f build/buttons.conf #not needed on ESPs
tar -czf build.tar.gz build