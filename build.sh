#!/bin/bash

echo 'Build Node sandbox...'
pushd $(pwd)
cd sandbox/node
npm i
popd

echo 'Build browser sandbox...'
pushd $(pwd)
cd sandbox/browser
npm i
popd

docker build -t mpst_ts .