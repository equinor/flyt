#!/bin/bash

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment
echo "window._env_ = {" >>./env-config.js

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]]; do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varName=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varValue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varName}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varValue}

  # Append configuration property to JS file
  echo "  $varName: \"$value\"," >>./env-config.js
done <.env

echo "}" >>./env-config.js

# The above was borrowed from
# https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/

# Setup nginx proxy for the api base url
cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.temp &&
  envsubst "\$REACT_APP_API_BASE_URL" </etc/nginx/conf.d/default.conf.temp >/etc/nginx/conf.d/default.conf
