## Flyt - (aka VSM/Value Stream Mapping)

![Flyt canvas (13) - Process feedback on 'Flyt'  - Wednesday, September 15, 2021](https://user-images.githubusercontent.com/3164065/133470524-d6934d90-82ce-4870-aea3-450fd1f4c48f.png)

# Links

- :inbox_tray: [Bug and feature tracker](https://github.com/orgs/equinor/projects/361/views/34)
- :1234: [Feature backlog (and prioritisation)](https://github.com/orgs/equinor/projects/141/)
- :art: [Figma design & prototype](https://www.figma.com/file/IkHwmIQrsT0iR34f5R5UnZ/vsm)
- :zap: [API endpoints](https://api-flyt-api-dev.radix.equinor.com/swagger/index.html)
- :dizzy: [Development process](https://flyt.equinor.com/process/172)
- 🏃 [Running in Radix](https://console.radix.equinor.com/applications/flyt/)
- :memo: [Architecture contract](https://github.com/equinor/architecturecontract/blob/master/contracts/flyt.md)

# Background

Mission statement: Empower everyone on all levels to improve the way we work - process by process

# Tech stack

|                  | Comment                                                                                        |
|------------------|------------------------------------------------------------------------------------------------|
| Language         | [TypeScript](https://www.typescriptlang.org/)                                                  |
| Library          | [React](https://react.dev/)                                                                    |
| Framework        | [Next.js](https://nextjs.org/)                                                                 |
| Process renderer | [React Flow](https://reactflow.dev/)                                                           |
| State management | [EasyPeasy](https://easy-peasy.vercel.app/)                                                    |
| Linting          | [ESLint](https://eslint.org/)                                                                  |
| Code-Style       | [Prettier](https://prettier.io/)                                                               |
| Authentication   | [@azure/msal-react](https://github.com/AzureAD/microsoft-authentication-library-for-js#readme) |
| Styling          | [Sass](https://sass-lang.com/)                                                                 |
| Package manager  | [Yarn](https://yarnpkg.com/)                                                                   |

# Developing

To get up and running, run:

```bash
yarn && yarn use-dev
```

## Running different environments locally

| Env. |     command     |
|------|:---------------:|
| DEV  | `yarn use-dev`  |
| TEST | `yarn use-test` |
| QA   |  `yarn use-qa`  |
| PROD | `yarn use-prod` |

## Branching and deploying stuff

The `main`-branch contains the latest changes.

To release you you run one of the following scripts:

| Environment | Release script      | Deploy status                                                                                                                   | URL                                        | Who should test what?       | Comments                                                                         |
|-------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|-----------------------------|----------------------------------------------------------------------------------|
| DEV         | `yarn release-dev`  | ![DEV environment build status in Radix](https://api.radix.equinor.com/api/v1/applications/flyt/environments/dev/buildstatus)   | <https://web-flyt-dev.radix.equinor.com/>  | Developer                   | Developer is free to use this environment however they want to                   |
| TEST        | `yarn release-test` | ![TEST environment build status in Radix](https://api.radix.equinor.com/api/v1/applications/flyt/environments/test/buildstatus) | <https://web-flyt-test.radix.equinor.com/> | Internal testing            | Developer tags what needs to be tested for QA-tester in the team                 |
| QA          | `yarn release-qa`   | ![QA environment build status in Radix](https://api.radix.equinor.com/api/v1/applications/flyt/environments/qa/buildstatus)     | <https://web-flyt-qa.radix.equinor.com/>   | "Product Owner" or Customer | When said feature is ready, it gets released into QA so our PO can give feedback |
| PROD        | `yarn release-prod` | ![PROD environment build status in Radix](https://api.radix.equinor.com/api/v1/applications/flyt/environments/prod/buildstatus) | <https://web-flyt-prod.radix.equinor.com/> | End-users                   | We wait with deploying to prod until everyone is happy                           |

## Docker

```bash
# Building image
docker build -t equinor-flyt .

# Running image
## Dev
docker run -p 3000:3000 --env-file ./environment-variables/DEV.env equinor-flyt
## Test
docker run -p 3000:3000 --env-file ./environment-variables/TEST.env equinor-flyt
## QA
docker run -p 3000:3000 --env-file ./environment-variables/QA.env equinor-flyt
## Prod
docker run -p 3000:3000 --env-file ./environment-variables/PROD.env equinor-flyt
```

## Runtime environment variables

When using Next.js, the environment variables need to be set when building the image and not at runtime.

> Generally you'll want to use build-time environment variables to provide your configuration. The reason for this is that runtime configuration adds rendering / initialization overhead and is incompatible with Automatic Static Optimization.
>
> [Read more ...](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)

To work-around this we are disabling "automatic static optimization" at our root level. Adding this to `_app.tsx`:

```javascript
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
```

Which disables "automatic static optimization" for all our
pages. [Read more ...](https://github.com/vercel/next.js/blob/master/errors/opt-out-auto-static-optimization.md)

# Semantic Commit Messages

> Copied from <https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716>

See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

## Example

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- <https://www.conventionalcommits.org/>
- <https://seesparkbox.com/foundry/semantic_commit_messages>
- <http://karma-runner.github.io/1.0/dev/git-commit-msg.html>
