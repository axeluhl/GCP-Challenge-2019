#!/bin/bash
bn=`basename $1 .json`
echo $(cat pubsub_event_template.json)'"'$(cat $1 | base64 -w 0)'"}' >${bn}_as_pubsub_event.json
