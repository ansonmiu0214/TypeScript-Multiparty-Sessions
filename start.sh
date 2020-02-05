#!/bin/bash

docker run --hostname mpst_ts -v $(pwd)/mpst_ts:/home/mpst_ts -it --rm mpst_ts bash