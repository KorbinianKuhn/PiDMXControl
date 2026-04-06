#!/bin/bash

# Remove files from the Pico
mpremote connect auto fs rm main.py :

# List files on the Pico
mpremote connect auto fs ls