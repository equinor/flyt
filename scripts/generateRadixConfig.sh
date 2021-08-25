#!/bin/bash

echo 'Generating Radixconfig file with data from "environments-variables"-folder'

currentRadixName=$(
  grep '"radix-name":' package.json |
    awk -F: '{ print $2 }' |
    sed 's/[",]//g' |
    tr -d '[:space:]'
)

#if radix name is not changed. Ake still "mad-template"
#Show a warning that you should change it.
if [ "$currentRadixName" = "mad-template" ]; then
  printf "\e[91m%b\e[0m" "No radix-name set in package.json \n"
  echo "Please fix then run 'yarn genRadix' again."
fi
export RADIX_NAME=$currentRadixName

source environment-variables/DEV.env
export DEV_API_BASEURL=$API_BASEURL
export DEV_AUDIENCE=$AUDIENCE
export DEV_AUTHORITY=$AUTHORITY
export DEV_CLIENT_ID=$CLIENT_ID
export DEV_ENVIRONMENT=$ENVIRONMENT
export DEV_SCOPE=$SCOPE

source environment-variables/TEST.env
export TEST_API_BASEURL=$API_BASEURL
export TEST_AUDIENCE=$AUDIENCE
export TEST_AUTHORITY=$AUTHORITY
export TEST_CLIENT_ID=$CLIENT_ID
export TEST_ENVIRONMENT=$ENVIRONMENT
export TEST_SCOPE=$SCOPE

source environment-variables/QA.env
export QA_API_BASEURL=$API_BASEURL
export QA_AUDIENCE=$AUDIENCE
export QA_AUTHORITY=$AUTHORITY
export QA_CLIENT_ID=$CLIENT_ID
export QA_ENVIRONMENT=$ENVIRONMENT
export QA_SCOPE=$SCOPE

source environment-variables/PROD.env
export PROD_API_BASEURL=$API_BASEURL
export PROD_AUDIENCE=$AUDIENCE
export PROD_AUTHORITY=$AUTHORITY
export PROD_CLIENT_ID=$CLIENT_ID
export PROD_ENVIRONMENT=$ENVIRONMENT
export PROD_SCOPE=$SCOPE

rm radixconfig.yaml
(echo "#!/bin/bash" && echo "cat <<EOF >radixconfig.yaml" && cat radixconfig-template.yaml && echo "EOF") >temp.yaml.sh
bash temp.yaml.sh && rm temp.yaml.sh

echo 'Done!'
