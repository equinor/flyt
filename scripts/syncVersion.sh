#!/bin/sh

currentVersion=$(
  grep '"version":' package.json |
    awk -F: '{ print $2 }' |
    sed 's/[",]//g' |
    tr -d '[:space:]'
)

sedi() {
  #   MacOS is using bsd sed, so defining this function to support gnu/linux syntax as well
  #   We test for the --version option which is only found in the GNU version of sed.
  #   ref https://stackoverflow.com/questions/2320564/sed-i-command-for-in-place-editing-to-work-with-both-gnu-sed-and-bsd-osx
  if [ "$(sed --version >/dev/null 2>&1)" ]; then
    sed -i -- "$@" #GNU
  else
    sed -i "" "$@" #BSD
  fi
}

sedi -E "s/APP_VERSION=.+/APP_VERSION=$currentVersion/" .env
sedi -E "s/APP_VERSION=.+/APP_VERSION=$currentVersion/" environment-variables/DEV.env
sedi -E "s/APP_VERSION=.+/APP_VERSION=$currentVersion/" environment-variables/TEST.env
sedi -E "s/APP_VERSION=.+/APP_VERSION=$currentVersion/" environment-variables/QA.env
sedi -E "s/APP_VERSION=.+/APP_VERSION=$currentVersion/" environment-variables/PROD.env

echo "Updated environment variables with version from package.json"
