#!/bin/bash

# make sure that args 1 and 2 are set
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./start.sh <ign> <region>"
    echo "Example: ./start.sh YourAccount1234 eu"
    exit 1
fi

while [ true ]; do

    node index.js $1 $2 | tee log.txt

    echo "--- BOT RESTARTING ---"

    echo Press CTRL + C to stop.

done
