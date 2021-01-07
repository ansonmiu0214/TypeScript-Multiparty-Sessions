#!/usr/bin/bash

# Clean old logs
./clean.sh

if [ "$#" -eq  "0" ]
then
    ARGS=(-m 100 1000 -r 20)
else
    ARGS=("$@")
fi

cd ~/perf-benchmarks/simple_pingpong
python3.8 scripts/all.py "${ARGS[@]}"

cd ../complex_pingpong
python3.8 scripts/all.py "${ARGS[@]}"