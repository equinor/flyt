#!/bin/bash

currentName=$(
  grep '"name":' package.json |
    awk -F: '{ print $2 }' |
    sed 's/[",]//g' |
    tr -d '[:space:]'
)

read -r -p "What do you want to name it? ($currentName) " newName

if [ -z "$newName" ]; then
  newName=$currentName
  echo "No name provided... continuing using $currentName"
else

  sedi() {
    #   MacOS is using bsd sed, so defining this function to support gnu/linux syntax as well
    #   We test for the --version option which is only found in the GNU version of sed.
    #   ref https://stackoverflow.com/questions/2320564/sed-i-command-for-in-place-editing-to-work-with-both-gnu-sed-and-bsd-osx
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
  }

  if [ "$currentName" != "" ] && [ "$newName" != "" ]; then
    sedi -e "s/$currentName/$newName/g" README.md
    sedi -e "s/$currentName/$newName/g" package.json
  fi

  #Re-generating radixconfig-file
  sh ./scripts/generateRadixConfig.sh

  echo "Finished updating the name"
  echo "Please verify that the changes were applied correctly: "
  printf "Changed files:
  - README.md
  - package.json
"
fi
