# Releasing the CLI

The [Release workflow](../../.github/workflows/release.yml) releases the single
`@reactionable/cli` package through preparation, CI validation, publication and
documentation deployment. It uses HoverKraft's reusable workflows. Release notes
live in GitHub Releases; there is no source `CHANGELOG.md` or custom release script.

Preparation, validation and publication use the same stable HoverKraft release.
Their immutable version pins live in the workflow files. The Pages action also
uses a published ci-github-publish release.

## Configure publishing

Before running a release:

- Create a `release` environment that permits release tags for npm publication.
- Install the release GitHub App on this repository with Actions and Contents
  write access and Pull requests read access. Set `CI_BOT_APP_CLIENT_ID` as a
  repository or organization variable and `CI_BOT_APP_PRIVATE_KEY` as a repository
  or organization secret. The caller explicitly maps them to the preparation
  workflow's `github-app-client-id` input and `github-app-key` secret. Preparation
  has no environment binding. Permit that App to push release
  commits under branch and tag rules.
- For AI release summaries, store the complete
  [`release/create` summary configuration](https://github.com/hoverkraft-tech/ci-github-publish/tree/main/actions/release/create)
  as a repository or organization secret named `CHANGELOG_SUMMARY`. Include
  `llmAuth` and choose the provider and model with `llmProvider` and `llmModel`;
  all upstream options are supported. The caller passes this JSON through the
  `changelog-summary` workflow secret. Without it, release notes have no AI summary.
- Configure an active npm trusted publisher for `@reactionable/cli`, repository
  `reactionable/reactionable-cli`, workflow `release.yml`, environment `release`,
  with direct npm publishing enabled. An expired trusted publisher must be
  deleted and recreated in npm's settings.
- Allow release tags in the `github-pages` environment for documentation deploys.
- Ensure branch and tag rules permit the preparation commit and tag.

The shared preparation workflow creates and revokes a repository-scoped GitHub App
installation token. The consumer needs no token-generation steps. GitHub's
API signs version commits for that App; preparation requires a verified signature
before atomically pushing the commit to `main` and creating its tag. The manifest
and lockfile version on `main` therefore match the prepared release version.
Publication uses `GITHUB_TOKEN` for GitHub operations and npm OIDC, with no
npm token.

For a ruleset requiring pull requests, add the installed release App to its bypass
list with **Always allow**. **For pull requests only** does not permit preparation's
direct version commit. Bypass applies to the entire ruleset: keep the PR requirement
in a separate ruleset from required signatures, deletion protection and force-push
protection to grant the App only the exception it needs. Any tag rules must also
permit creating the release tag.

The planned version must not be older than the committed version. If it already
matches the manifest, preparation applies it to the lockfile and tags the existing
source when nothing changes. Existing tags are never overwritten.

## Run a release

Run **Actions → Release → Run workflow** on `main`, or wait for Monday at
08:25 UTC. HoverKraft plans a version from Conventional Commits, updates the npm
manifest and lockfile, and pushes the version commit and tag atomically.
It then dispatches the same workflow at the tag. Follow that second run for the
publication result.

Leave the manual **force** checkbox unchecked to skip when no release is needed.
Check it to prepare a release even without changes. Higher planned versions are
preserved; an unchanged plan receives a patch bump. For example:

```sh
gh workflow run release.yml --ref main -f force=true
```

Scheduled runs keep normal no-change behavior. Existing tag runs ignore force
and recover the same version. Builds, tests and tag collision checks still apply.

The caller passes the same partial `release-config` to preparation and publication
to preserve its `v` tag prefix. Other release settings inherit HoverKraft defaults.
Supported settings and override behavior are documented by
[`ci-github-publish/actions/release/plan`](https://github.com/hoverkraft-tech/ci-github-publish/tree/main/actions/release/plan)
and
[`ci-github-publish/actions/release/create`](https://github.com/hoverkraft-tech/ci-github-publish/tree/main/actions/release/create).

Only preparation status `ready` starts CI in the tag run. `dispatched`,
`no-changes` and `released` do not start publication in that run.

1. Shared CI builds and tests the CLI, builds documentation and packages the
   distributable. Default package checks validate the packed manifest and declared
   entry files. Additional CLI checks install the tarball in an isolated directory,
   check executable help/version and the compiled template, then validate npm
   publication with a dry run. The same checks run on pull requests.
2. Release waits for successful CI and consumes its validated tarball. It verifies
   the artifact's run and source commit and the package identity, creates a draft
   with the optional AI summary, publishes through npm trusted publishing and
   finalizes the GitHub release. It never rebuilds, repacks or runs consumer tests.
   Finalization checks existing asset digests and attaches the original published
   or recovered tarball without overwriting conflicting assets.
3. After successful publication, one Pages job deploys the built documentation
   and runs the action's URL availability and Lighthouse checks.

[Shared CI](../../.github/workflows/__shared-ci.yml) exposes the validated tarball
and a separate build artifact containing `dist` and `build/docs`:

| Output                        | Used by                          |
| ----------------------------- | -------------------------------- |
| `package-tarball-artifact-id` | npm and GitHub release           |
| `build-artifact-id`           | Pages (`build-path: build/docs`) |

CI packaging skips dependency installation and npm lifecycle hooks. All generated
package files must be included in the build artifact.
The `files` field in [package.json](../../package.json) includes `bin` and `dist`.
[.node-version](../../.node-version) selects the CI runtime; `.nvmrc` links to it
for local development.

## Validate a change

The unchanged pull request workflow runs shared CI for lint, build, tests,
packaging, installed CLI checks and npm publication dry runs. Version preparation
and actual publication run only through the manual or scheduled Release workflow.

For local checks, run `npm ci`, `npm run lint`, `npm run build`, `npm test`, and
`npm run build:doc`. Validate workflow edits with Actionlint.

## Recovery

Before preparation creates a tag, fix the failure and run from `main` again.
Rerun failed publication jobs to reuse the validated CI package artifact without
rebuilding or repacking. To rerun CI and resume publication, dispatch the
original tag:

```sh
gh workflow run release.yml --ref v1.2.3
```

A retry uses the committed version. The shared release workflow enables
`recover-existing` internally: if npm publication already succeeded, it restores
the original tarball with integrity verification instead of publishing again.
Finalization uses those original bytes for the release attachment. Matching assets
and published notes are preserved. Registry errors or conflicting assets require
investigation. If only documentation deployment fails, rerun its failed job.

The separate `.github/workflows/prepare-release.yml` labels pull requests through
ci-github-publish. It runs when a PR opens or changes, including title edits.
Package version updates and publication remain in `.github/workflows/release.yml`.
