#!/bin/bash

# Check if parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-neopixel-a>"
    exit 1
fi

NEOPIXEL_A="$1"

# Copy files to the Pico
mpremote connect auto fs cp "$NEOPIXEL_A/config.py" :
mpremote connect auto fs cp src/umqttsimple.py :
mpremote connect auto fs cp src/pixel.py :
mpremote connect auto fs cp src/main.py :

# List files on the Pico
mpremote connect auto fs ls