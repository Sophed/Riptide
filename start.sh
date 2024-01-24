#!/bin/bash


while [ true ]; do

    node . | tee log.txt

    echo "--- BOT RESTARTING ---"

    echo Press CTRL + C to stop.

done
