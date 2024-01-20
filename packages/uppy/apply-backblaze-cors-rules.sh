#/bin/bash

source ../../.env
echo "allowedOrigin ${NEXT_PUBLIC_SITE_URL} to bucket ${UPPY_B2_BUCKET}"
b2-linux \
  update-bucket \
  --corsRules "[{\"corsRuleName\":\"allowUploads\", \"allowedOrigins\": [\"${NEXT_PUBLIC_SITE_URL}\"], \"allowedHeaders\": [\"*\"], \"allowedOperations\": [\"s3_head\", \"s3_get\", \"s3_put\"], \"exposeHeaders\": [\"x-bz-content-sha1\", \"etag\"], \"maxAgeSeconds\": 3600}]" \
  "${UPPY_B2_BUCKET}" allPrivate
