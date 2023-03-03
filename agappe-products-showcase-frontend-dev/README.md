# VR Agappe Products Showcase

## Project setup
```
npm i
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build:production
```

### Lints and fixes files
```
npm run lint
```
## Release Process 🏗

- Once all features/bugfixes are deployed on `dev`, create a PR from `dev` to `test`
- Once the PR is merged from `dev` -> `test`, run `npm run release` & ship.js will trigger a build with updated [CHANGELOG](./CHANGELOG.md) & proper [git tags](https://github.com/SaintGenesis/agappe-products-showcase-frontend/tags)
- Follow the guide from the automated PR from Ship.js
- Once you **Squash & Merge** the automated PR, wait for the [Ship.js trigger](https://github.com/SaintGenesis/agappe-products-showcase-frontend/actions/workflows/shipjs-trigger.yml) workflow to run successfully.
- Rebase your `dev` with `test` to ensure the correct release is also displayed on `dev` env
- Once the QA gives a sign off on `test` env, rebase `stage` with `test` to update the UAT environment

## Branching Strategy 🎋

- Create your feature branch from `dev` branch, eg. `feat/add-web-worker-JIRA-123`
- Create a new PR from `feat/add-web-worker-JIRA-123` to `dev`
- Once the PR is merged into `dev`, create a new PR from `dev` to `test`
- Once the PR is merged into `test`, rebase `dev` with `test`, eg. `git fetch --all && git checkout dev && git rebase origin/test && git push`
- Checkout on `test` & then run a new ship.js release workflow by running `npm run release:prepare` (Ensure you have a valid GitHub PAT in .env [GITHUB_TOKEN=PAT])
- Ship.js will automatically update the [CHANGELOG](./CHANGELOG.md) & once you review and **Sqaush Merge** the PR
- Inform on Teams about the new release so that QA team can test on the newer version
- Once the QA passes all the tests, rebase the `stage` branch with `test`
- Once the PR is merged, you **HAVE** to rebase `dev` & all your other branches/PRs which haven't gone in the previous release.

```bash
$ git fetch --all && git checkout dev && git rebase origin/test && git push
```
Once ship.js automatically prepares the Pull Request, kindly merge it and rest is done automatically by GitHub action and is driven by `deployment.yml` file.



## Contributing ✍🏻

_Note_: Commits & PRs will be allowed only if the commit messages & PR titles follow a [conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0), read more about it [here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum)

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a new branch from the default branch, add commits, and [open a pull request](https://github.com/SaintGenesis/agappe-products-showcase-frontend/compare)

### Customize configuration for vue-cli
See [Configuration Reference](https://cli.vuejs.org/config/).
