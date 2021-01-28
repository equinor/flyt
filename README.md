VSM - Value Stream Mapping
---

![Canvas example](./documentation/images/canvasExample.png)

# Links

- [Figma design & prototype](https://www.figma.com/file/IkHwmIQrsT0iR34f5R5UnZ/VSM)

# Tech stack

|                   |                    Comment                      |     
|-------------------|-------------------------------------------------|
| Library           | This is a [React](https://reactjs.org/) project |
| Package manager   | We use the [Yarn](https://yarnpkg.com/) -package-manager. To get started, run ``yarn && yarn start`` |
| Canvas tools      | We heavily rely on canvas and use PixiJS to ease development.     |
| Navigation        | [react-router](https://reactrouter.com/)                          |
| State management  | [Redux](https://redux.js.org/), together with [Redux Toolkit](https://redux-toolkit.js.org/), and [React Redux](https://react-redux.js.org/) |
| Testing           | [Testing-Library](https://testing-library.com/)                  |
| Code-Style        | We use [ESLint](https://eslint.org/) together with [Prettier](https://prettier.io/) for linting and enforcing a consistent code-style.  |   
| Authentication    | [@azure/msal-react](https://github.com/AzureAD/microsoft-authentication-library-for-js#readme) |

# Developing

To get up and running:
`yarn && yarn start`

## Docker

```bash
# Building image
docker build -t vsm .


# Running image
## Dev
docker run -p 3000:80 --env-file ./environment-variables/DEV.env vsm  
## Test
docker run -p 3000:80 --env-file ./environment-variables/TEST.env vsm  
## QA
docker run -p 3000:80 --env-file ./environment-variables/QA.env vsm  

docker run -p 3000:80 -e REACT_APP_API_BASE_URL=https://api.statoil.com/app/vsm/qa -e REACT_APP_API_SCOPE=b78f9306-406d-4fa8-98e5-001dcd933ff4/user_impersonation  -e REACT_APP_CLIENT_ID=7fe4fa03-733a-414d-8d32-0a9358b5eeb9 -e REACT_APP_TENANT_ID=3aa4a235-b6e2-48d5-9195-7fcf05b459b0 vsm
## Prod 
docker run -p 3000:80 --env-file ./environment-variables/PROD.env vsm  
```


## Branching and deploying stuff
We use a simple branching structure.
Instead of having a `master` and `develop` branch we just use one `main`-branch.

The `main`-branch contains the latest changes.

We use a "sliding tag" for each environment...
Tag something DEV, TEST, QA or PROD, and it should trigger a new build and release.
This gets rid of the "empty Pull requests" for releases, which is something we would have if we do a PR into `Master` from `Develop`.
Also, this gives us more flexibility to release from another branch if we need to do that for some reason.
 
I've added a simple script to automate this:
 For example; Run `yarn release-dev` to tag DEV and push tags to GitHub.


| Environment | Release script    | URL                                     | Who should test what?  | Comments                                                                              | 
|-------------|-------------------|-----------------------------------------|------------------------|---------------------------------------------------------------------------------------|
| DEV         |Run `yarn release-dev` | https://web-vsm-dev.radix.equinor.com/  | Developer              | Developer is free to use this environment however they want to                        |
| TEST        |Run `yarn release-test`| https://web-vsm-test.radix.equinor.com/ | Internal testing       | Developer tags what needs to be tested for QA-tester in the team                      |
| QA          |Run `yarn release-qa`  | https://web-vsm-qa.radix.equinor.com/   | "Product Owner" or Customer | When said feature is ready, it gets released into QA so our PO can give feedback |
| PROD        |Run `yarn release-prod`| https://web-vsm-prod.radix.equinor.com/ | End-users              | We wait with deploying to prod until everyone is happy                                |

## Runtime environment variables

> When using CRA, the environment variables need to be set when building the image and not at runtime.
That means that we need to build an image for each environment...
For more information, take a look at the following issue:
https://github.com/facebook/create-react-app/issues/2353

To work-around this we are running env.sh that adds our runtime environment variables to the browser-window.

## Cors
We are running an NGINX proxy for api-requests.
NGINX is expecting an environment variable called `REAC_APP_API_BASE_URL`.
Example: `REAC_APP_API_BASE_URL: https://api.statoil.com/app/vsm/dev/api`

# Pixi js Canvas
## Making space for stuff
Plan: Put every Main activity and all it's children inside a container.
That container width can be used to figure out the distance to the next Main Activity etc...

# Defining a process

A process consists of a set of entities.

An entity can be of the following types:

- MainActivity
- SubActivity
- Choice
- Waiting

Structure of an entity

```json5
{
  id: '',
  type: 'MainActivity',
  text: '',
  roles: [],
  duration: 0,
  problems: [],
  ideas: [],
  solutions: [],
  parentId: ''
}
```

App can ask for all entities in a project. API returns an array of all entities for the client to populate the view
with.

``
[{entity},{entity},{entity}]
``

To update an entity

# API-Endpoints
See swagger https://vsm-api-dev.azurewebsites.net/swagger/index.html

## Project

Create Project Read Project Update Project Delete Project

### Project object

Details WIP

```JSON5
{
  id: '',
  owner: [],
  created: date,
  lastUpdated: date,
  Entities: []
  // [{entity},{entity},{entity}],
}
```

## Entity

### Create Entity

POST ``/entity``

body:

```JSON5
{
  id: '',
  type: 'Main Activity',
  text: '',
  roles: [],
  duration: '',
  problems: [],
  ideas: [],
  solutions: [],
  parentId: ''
}
```

### Read Entity

GET ``/entity/{id}``

### Update Entity

PUT (or PATCH?) ``/entity/{id}``

### Delete Entity

DELETE ``/entity/{id}``

# Create-React-App

This project was ejected from [Create React App](https://github.com/facebook/create-react-app), using
the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will
remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right
into your project so you have full control over them. All of the commands except `eject` will still work, but they will
point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you
shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Post new process - Example request bodys

## Just the standard stuff
```typescript
  postData(accessToken, `/api/v1.0/project`, {
    name: processTitle,
    objects: [
      {
        parent: 0,
        name: processTitle,
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier, name: "supplier" },
          { fkObjectType: vsmObjectTypes.input, Name: "input" },
          { fkObjectType: vsmObjectTypes.output, name: "output" },
          { fkObjectType: vsmObjectTypes.customer, name: "customer" },
        ],
      },
    ],
  } as vsmProcessObject)
```
## Everything but the kitchen sink
>NB. Actually missing choice. (Waiting on api-support) 
```typescript
          postData(accessToken, `/api/v1.0/project`, {
  name: processTitle,
  objects: [
    {
      parent: 0,
      name: processTitle,
      fkObjectType: vsmObjectTypes.process,
      childObjects: [
        { fkObjectType: vsmObjectTypes.supplier, name: "supplier" },
        { FkObjectType: vsmObjectTypes.input, Name: "input" },
        {
          FkObjectType: vsmObjectTypes.mainActivity,
          Name: "Choose method",
          childObjects: [
            {
              name: "Kaffetrakter",
              fkObjectType: vsmObjectTypes.subActivity,
            },
            {
              name: "Presskanne",
              fkObjectType: vsmObjectTypes.subActivity,
              childObjects: [
                {
                  name: "Finn presskanne",
                  fkObjectType: vsmObjectTypes.subActivity,
                },
              ],
            },
          ],
        },
        {
          FkObjectType: vsmObjectTypes.mainActivity,
          Name: "Boil water",
          childObjects: [
            {
              name: "Tilsett kaffe til presskanne",
              fkObjectType: vsmObjectTypes.subActivity,
            },
          ],
        },
        {
          FkObjectType: vsmObjectTypes.waiting,
          Name: "Waiting",
        },
        {
          FkObjectType: vsmObjectTypes.mainActivity,
          Name: "Add water",
          childObjects: [
            {
              name: "Waiting",
              fkObjectType: vsmObjectTypes.waiting,
              childObjects: [
                {
                  name: "Press kaffe",
                  fkObjectType: vsmObjectTypes.subActivity,
                  childObjects: [
                    {
                      name: "Pour coffee",
                      fkObjectType: vsmObjectTypes.subActivity,
                    },
                  ],
                },
              ],
            },
          ],
        },
        { fkObjectType: vsmObjectTypes.output, name: "output" },
        { fkObjectType: vsmObjectTypes.customer, name: "customer" },
      ],
    },
  ],
} as vsmProcessObject)
```

```text

https://login.microsoftonline.com/statoilsrm.onmicrosoft.com/oauth2/authorize?
client_id=e6e2f3c4-d6bd-4d71-a00e-be0c16a703da
&response_type=code
&redirect_uri=https://www.getpostman.com/oauth2/callback
&nonce=1234
&resource=b3e899bf-12af-4f63-8744-d1ef4edc30b5
&prompt=consent
```

# NEW NEW Template

Routing
State management
