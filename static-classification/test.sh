#!/bin/bash
curl -i -X POST -H "Ce-Type: true" -H "Ce-Specversion: true" -H "Ce-Source: true" -H "Ce-Id: true" -H "Content-Type: application/json" -H "Content-Type: application/json" --data @../doc/ocr_result_as_pubsub_event.json "http://localhost:8080"
