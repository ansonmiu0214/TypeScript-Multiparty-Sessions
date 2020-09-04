#!/bin/bash

for dir in sandbox/node/*/
do
  if [ $(basename $dir) != "node_modules" ]
  then
    echo "Removing $dir"
    rm -r $dir
  fi
done

for dir in sandbox/browser/*/
do
  if [ $(basename $dir) != "node_modules" ]
  then
    echo "Removing $dir"
    rm -r $dir
  fi
done

python3 -m mpst_ts.tests.system