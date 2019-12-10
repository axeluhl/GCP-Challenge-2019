gcloud functions deploy classificationCollector --region=europe-west2 \
  --runtime nodejs8 \
  --trigger-topic classification_result \
  --service-account classifier-account@hackathon-sap19-wal-1009.iam.gserviceaccount.com
