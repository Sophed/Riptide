#!/bin/bash

# make sure that args 1 and 2 are set
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./start.sh <ign> <region> [chat-monitoring]"
    echo "Example: ./start.sh YourAccount1234 eu true"
    exit 1
fi

MONITORING="false"

# is arg 3 set?
if [ -z "$3" ]; then
    echo "Starting without chat monitoring..."
else
    MONITORING=$3
    echo "Starting with chat monitoring..."
fi

while [ true ]; do

    node index.js $1 $2 $MONITORING | tee log.txt

    echo "--- BOT RESTARTING ---"

    echo Press CTRL + C to stop.

done
