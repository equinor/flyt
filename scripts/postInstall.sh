#!/bin/sh

patch-package
if [ "$NODE_ENV" = 'production' ]; then
  echo "RUNNING IN PRODUCTION"
  echo "Skipping postInstall scripts"
else
  currentName=$(
    grep '"name":' package.json |
      awk -F: '{ print $2 }' |
      sed 's/[",]//g' |
      tr -d '[:space:]'
  )

  if [ "$currentName" = "mad-template" ]; then
    printf "👋 Hi! It looks like you are setting up a new project...\n"
    . scripts/changeName.sh
  fi
fi
