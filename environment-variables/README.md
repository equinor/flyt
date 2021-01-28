# .env file
 
These environment variables are made available to the client by `react-scripts start`

They need to be named REACT_APP_something if you want to use them in the runtime. (When running yarn start etc)
 
You can find them added to the process.env-object.
>       Example: process.env.REACT_APP_API_BASE_URL

```bash
# .env file

# The following config is for dev-environment.
# APP
REACT_APP_WEBSITE_NAME=VSM
REACT_APP_CLIENT_ID=e6e2f3c4-d6bd-4d71-a00e-be0c16a703da
REACT_APP_VERSION=$npm_package_version

# API
REACT_APP_API_BASE_URL=https://api.statoil.com/app/vsm/dev
# API Scope - format is guid/scope
REACT_APP_API_SCOPE=c001f24f-64a7-4f0c-bfe8-bf9c8e7aa74c/api.access

# Project
EXTEND_ESLINT=true
REACT_APP_TENANT_ID=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
```
