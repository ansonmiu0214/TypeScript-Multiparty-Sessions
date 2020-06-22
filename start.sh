#!/bin/bash

docker run --hostname mpst_ts -v $(pwd)/mpst_ts:/home/mpst_ts -v $(pwd)/protocols:/home/protocols -v $(pwd)/examples:/home/examples -v $(pwd)/sandbox:/home/sandbox -v $(pwd)/benchmarks:/home/benchmarks -v $(pwd)/demo:/home/demo -it --rm mpst_ts bash
