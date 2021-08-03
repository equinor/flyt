#!/bin/bash

echo 'Generating Radixconfig file with data from "environments-variables"-folder'

#DEV ENVIRONMENT
source environment-variables/DEV.env
export DEV_API_BASEURL=$API_BASEURL
export DEV_APP_NAME=$APP_NAME
export DEV_AUTHORITY=$AUTHORITY
export DEV_CLIENT_ID=$CLIENT_ID
export DEV_ENVIRONMENT=$ENVIRONMENT
export DEV_SCOPE=$SCOPE
export DEV_APP_VERSION=$APP_VERSION
export DEV_API_HUB_URL=$API_HUB_URL

#TEST ENVIRONMENT
source environment-variables/TEST.env
export TEST_API_BASEURL=$API_BASEURL
export TEST_APP_NAME=$APP_NAME
export TEST_AUTHORITY=$AUTHORITY
export TEST_CLIENT_ID=$CLIENT_ID
export TEST_ENVIRONMENT=$ENVIRONMENT
export TEST_SCOPE=$SCOPE
export TEST_APP_VERSION=$APP_VERSION
export TEST_API_HUB_URL=$API_HUB_URL

#QA ENVIRONMENT
source environment-variables/QA.env
export QA_API_BASEURL=$API_BASEURL
export QA_APP_NAME=$APP_NAME
export QA_AUTHORITY=$AUTHORITY
export QA_CLIENT_ID=$CLIENT_ID
export QA_ENVIRONMENT=$ENVIRONMENT
export QA_SCOPE=$SCOPE
export QA_APP_VERSION=$APP_VERSION
export QA_API_HUB_URL=$API_HUB_URL

#PROD ENVIRONMENT
source environment-variables/PROD.env
export PROD_API_BASEURL=$API_BASEURL
export PROD_APP_NAME=$APP_NAME
export PROD_AUTHORITY=$AUTHORITY
export PROD_CLIENT_ID=$CLIENT_ID
export PROD_ENVIRONMENT=$ENVIRONMENT
export PROD_SCOPE=$SCOPE
export PROD_APP_VERSION=$APP_VERSION
export PROD_API_HUB_URL=$API_HUB_URL

rm radixconfig.yaml
(echo "#!/bin/sh" && echo "cat <<EOF >radixconfig.yaml" && cat radixconfig-template.yaml && echo "EOF") >temp.yaml.sh
sh temp.yaml.sh && rm temp.yaml.sh

echo 'Done!'
