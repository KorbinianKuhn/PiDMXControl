#!/bin/sh

# set dmx mode
pin=18
gpio=/sys/class/gpio/gpio$pin

if [ ! -d $gpio ] ; then 
   echo $pin > /sys/class/gpio/export
fi
echo out > $gpio/direction
echo 1 > $gpio/value