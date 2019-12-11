gcloud functions deploy static_classifier --region=europe-west2 \
  --project hackathon-sap19-wal-1009 \
  --runtime nodejs8 \
  --trigger-topic ocr_result
