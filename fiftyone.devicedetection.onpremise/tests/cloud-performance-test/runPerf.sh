#!/bin/sh

# Constants
PASSES=20000
PROFILE=MaxPerformance
HOST=localhost:3000
CAL=calibrate
PRO=process
PERF=./ApacheBench-prefix/src/ApacheBench-build/bin/runPerf.sh


$PERF -n $PASSES -s "node $PWD/../process.js $PROFILE" -c $CAL -p $PRO -h $HOST
