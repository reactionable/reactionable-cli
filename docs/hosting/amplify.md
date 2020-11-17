# Add Amplify hosting

Amplify hosting will be configured via the [Amplify cli](https://docs.amplify.aws/cli)

## Add authentication

Official documentation: https://docs.amplify.aws/cli/auth/overview

## Add an API

### GraphQL

Official documentation: https://docs.amplify.aws/cli/graphql-transformer/overview

#### Suggested configuration

> ? Do you want to add an API?\
> `y`

> ? Please select from one of the below mentioned services:\
> `GraphQL`

> ? Provide API name:\
> `myApiBackend`

> ? Choose the default authorization type for the API (Use arrow keys)\
> `Amazon Cognito User Pool`

> ? Do you want to configure advanced settings for the GraphQL API (Use arrow keys)\
> `No`

> ? Do you have an annotated GraphQL schema?\
> `n`

> ? Do you want a guided schema creation?\
> `y`

#### Manage "public" and "private" access

> ? Do you want to add an API? \
> `y`

> ? Please select from one of the below mentioned services:\
> `GraphQL`

> ? Provide API name:\
> `myApiBackend`

> ? Choose the default authorization type for the API (Use arrow keys)\
> `Amazon Cognito User Pool`

> ? Do you want to configure advanced settings for the GraphQL API (Use arrow keys)\
> `Yes, I want to make some additional changes.`

> ? Configure additional auth types?\
> `y`

> ? Choose the additional authorization types you want to configure for the API (**Press _`space`_ to select**, _`a`_ to toggle all, _`i`_ to invert selection)\
> `API key`

> ? Enter a description for the API key:\
> `My API Backend API KEY`

> ? After how many days from now the API key should expire (1-365):\
> `7`

> ? Configure conflict detection?\
> `n`

> ? Do you have an annotated GraphQL schema?\
> `n`

> ? Do you want a guided schema creation?\
> `y`

> ? What best describes your project:\
> `Objects with fine-grained access control (e.g., a project management app with owner-based authorization)`

> ? Do you want to edit the schema now? (Y/n)\
> `y`

## Add Amplify Hosting

> ? Select the plugin module to execute (Use arrow keys)\
> `Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)`

> ? Choose a type (Use arrow keys)\
> `Manual deployment`
