---
id: "creating-new-wordpress-project"
title: "Creating a New WordPress Project"
slug: "/Backend Starters/Decoupled WordPress/Creating a New Project"
sidebar_position: 2
---
## Choosing an Approach

### Use Build Tools if:

- Testing is an important part of your workflow

- You don’t want to manually push changes to your code repo.

### Use Dashboard Upstream if:

- You require a simpler setup

- The Pantheon repository is your source of truth

### Installing using Dashboard Upstream

- Create from Decoupled WordPress Composer Managed upstream:

  - Via the Pantheon Dashboard at this link:

    - [Decoupled WordPress Composer Managed](https://dashboard.pantheon.io/sites/create?upstream_id=c9f5e5c0-248f-4205-b63a-d2729572dd1f)

  - Or Alternatively via Terminus:

    ```
    terminus site:create my-new-site "Describe Site" empty --org='My Team Name' c9f5e5c0-248f-4205-b63a-d2729572dd1f
    ```

  :::note

  - Replace `'{My Team Name}'` with your team name - for example `My Agency`. This can also be omitted.
  - `c9f5e5c0-248f-4205-b63a-d2729572dd1f` is upstream_id for Decoupled WordPress Composer Managed.

  :::

## Install WordPress:

Visit the Site by clicking on the **Visit Development Site** button to Install via the UI—selecting. The same can be done via [`terminus remote:wp`](https://pantheon.io/docs/terminus/commands/remote-wp).

## Installing using Build Tools [Deprecated]

Currently it's not possible to install [Decoupled WordPress Composer Managed](https://github.com/pantheon-upstreams/decoupled-wordpress-composer-managed) via Build Tool. Although [decoupled-wordpress-recommended](https://github.com/pantheon-systems/decoupled-wordpress-recommended) can be installed via Build Tool.

## Prerequisites

- Composer (required for CMS backends): [Install Globally](https://getcomposer.org/download/)
- [Generate machine token](https://pantheon.io/docs/machine-tokens#create-a-machine-token) & [Authenticate into Terminus](https://pantheon.io/docs/machine-tokens#authenticate-into-terminus)
- [Install Terminus](https://pantheon.io/docs/terminus/install) (3.0.0 above required)
- Also install the following plugins:
  - `terminus self:plugin:install terminus-build-tools-plugin`
  - `terminus self:plugin:install terminus-power-tools`
  - `terminus self:plugin:install terminus-secrets-plugin`
  - Reload the terminus plugins: `terminus self:plugin:reload`
  - Clear cache for composer: `composer clear-cache`
  - Validate that the required plugins are installed: `terminus self:plugin:list`
- Create [Github Personal access tokens](https://github.com/settings/tokens)
- Create [CircleCI Personal API Tokens](https://app.circleci.com/settings/user/tokens)

## Installation

- Run the `terminus build:project:create` as follows:

  ```
  terminus build:project:create \
    --team='{My Team Name}' \
    --template-repository="git@github.com:pantheon-systems/decoupled-wordpress-recommended.git" \
    pantheon-systems/decoupled-wordpress-recommended \
    --ci-template='git@github.com:pantheon-systems/advanced-ci-templates' \
    --visibility private {PROJECT_NAME} \
    --stability=dev
  ```

  Replace `{PROJECT_NAME}` with a Project name for example `decoupled-wordpress`.

  Replace `{My Team Name}` with your team name - for example `My Agency`. This can also be omitted.

**Note:** This will result in a Github repository being created for this new codebase, a site being created on Pantheon and a CircleCI project being created for automated deployments.

### Additional Options

#### Using Other Git Hosts or CI Services

Terminus build tools supports a number of other combinations of git hosts and CI services.

For example, to use GitHub actions as your CI service, you could add the following additional flag to your `terminus build:project:create` command:

`--ci=githubactions`

Other possible values are `circleci`, `gitlab-pipelines` and `bitbucket-pipelines`.

Note: if using Github Actions, your token should have the "workflow" scope.

For more information, consult the [available services section of the build tools documentation](https://github.com/pantheon-systems/terminus-build-tools-plugin#available-services)

#### Using a GitHub Organization

`--org="{My Organization Name}"`

If you would like the repo created to be under a GitHub organization instead of the authenticated user's namespace, you can use the `--org` option.

For information on additional options, consult the [command options section of the build tools documentation](https://github.com/pantheon-systems/terminus-build-tools-plugin#command-options).
