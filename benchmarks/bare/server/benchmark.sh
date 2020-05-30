#!/bin/bash

MSGS=$1 npm start | tee logs/$1_$(date +%s).txt
