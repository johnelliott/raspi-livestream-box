#!/bin/bash
/usr/bin/arecord -D plughw:1 -f cd | /usr/bin/lame --preset cbr 128 -r -s 44.1 --bitwidth 16 - - | /usr/bin/ezstream -c /usr/local/lib/ezstream.xml
