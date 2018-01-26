# I am one with the force

> Search for Star Wars data.

## What’s Inside?

This application was built using some community projects, such as:

* [Node.js](https://nodejs.org)
* [Yarn](https://yarnpkg.com)
* [React](https://facebook.github.io/react/)
* and others.

## Installation

Before installing the application please make sure to have installed and in your `$PATH`:

* Node >= 8.9.4
* Yarn >= 1.3.2

Then run in a console:

```sh
yarn install
```

## Run a local instance

In a console run:

```sh
yarn start
```

Then open your browser on http://localhost:3000.

## Build the app for production

In a console run:

```sh
yarn build
```

Then the _build/_ folder can be served using a static server.
For example:

```sh
npx serve -s build
```

## Features

* The user can search using in a unique input
* The user can filter the results he obtained by resources (people, planets, etc.)
* The user see up to 5 result in each resources
* The search is preserved in a query parameter in the URL

## Missing features

* Search pagination
* Preserve the filter in query parameters
* Tests :)
