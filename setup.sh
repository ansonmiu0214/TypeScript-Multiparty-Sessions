#!/usr/bin/bash

# Prepare web-sandbox
cd /home/stscript/web-sandbox
cd node
npm i
cd ../browser
npm i
cd ../../

# Prepare case studies
cd /home/stscript/case-studies
for app in $(ls -d */); do
    pushd .
    cd $app
    npm i
    cd client
    npm i
    popd
done