#!/usr/bin/bash

for dir in */; do
    cd $dir
    npm i
    npm run build
    cd ..
done
