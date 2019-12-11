#!/bin/bash
curl -i -X POST -H "Content-Type: application/json" --data @../doc/ocr_result.json "http://localhost:8080"
