#!/bin/bash

MSGS=$1 npm run-script devStart | tee logs/$1_$(date +%s).txt
