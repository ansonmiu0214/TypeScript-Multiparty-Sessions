#!/usr/bin/bash

cd simple_pingpong
python3.8 scripts/all.py -m 100 1000 -r 20

cd ../complex_pingpong
python3.8 scripts/all.py -m 100 1000 -r 20