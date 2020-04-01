#!/bin/bash

pushd $(pwd)
cd sandbox/node
npm i
popd

docker build -t mpst_ts .