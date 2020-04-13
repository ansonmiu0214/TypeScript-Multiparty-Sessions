#!/bin/bash

docker run --hostname mpst_ts -v $(pwd)/mpst_ts:/home/mpst_ts -v $(pwd)/protocols:/home/protocols -v $(pwd)/sandbox:/home/sandbox -it --rm mpst_ts bash