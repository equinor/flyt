#!/bin/sh

if [ "$NODE_ENV" = 'production' ]; then
  echo "RUNNING IN PRODUCTION"
  echo "Skipping postInstall scripts"
else
  #Make sure the version is the same as in Package.json
  sh ./scripts/syncVersion.sh # Note that the runtime environment needs to be updated in radixconfig before push...

  currentName=$(
    grep '"name":' package.json |
      awk -F: '{ print $2 }' |
      sed 's/[",]//g' |
      tr -d '[:space:]'
  )

  if [ "$currentName" = "mad-template" ]; then
    printf "👋 Hi! It looks like you are setting up a new project...\n"
    sh scripts/changeName.sh
  fi
fi