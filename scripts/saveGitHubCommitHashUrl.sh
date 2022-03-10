#!/bin/sh

# Creates a new file called commitHashUrl.txt in the directory where the script is run.
# It exports the URL of the HEAD commit on to be displayed on GitHub.
SHORT_COMMIT_HASH=$(git rev-parse --short HEAD)
LONG_COMMIT_HASH=$(git rev-parse HEAD)
URL="\"https://github.com/equinor/MAD-VSM-WEB/commits/$LONG_COMMIT_HASH\""
printf "export const commitHash = \"%s\";\nexport const commitHashUrl =%s;" "$SHORT_COMMIT_HASH" "$URL" > commitHash.ts
