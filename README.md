# app-sprout-server

An opinionated starting point for Node backends.

**Goal**: Create a Node boilerplate that, when coupled with [app-sprout-client](https://github.com/RyanWarner/app-sprout-client), is able to register and login new users as well as CRUD some fields.


## Stack


#### Server

- [NodeJS](http://nodejs.org/)
- [Express](https://github.com/strongloop/express)

#### Database

- [MongoDB](http://www.mongodb.org/) with [Mongoose](https://github.com/LearnBoost/mongoose)

#### Build System

- [Gulp](http://gulp.com/)

#### Tests

- [Mocha](https://github.com/mochajs/mocha) with [Supertest](https://github.com/tj/supertest)

## Local Setup

### Prerequisites

1. [Homebrew](http://brew.sh/)
	- `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
	- `brew update`
	- `brew doctor`
	- `open ~./bash_profile`
	- Add `export PATH="/usr/local/bin:$PATH"` to your bash profile and save it.
1. [NodeJS](http://nodejs.org/)
	- `brew install node`
1. [Gulp](http://gulp.com/)
	- `npm install --global gulp`
1. [MongoDB](http://www.mongodb.org/)
	- `brew install mongodb`

### Start Up

1. Set environment variables. Open your bash profile and set:
	- `export NODE_ENV="development"`
	- `export SESSION_SECRET=“anything”`
	- `export NODE_HOST="YOUR_MAC.local:9000"` where `YOUR_MAC` is equal to your computer name as defined in System Preferences >> Sharing >> Computer Name.
1. `npm install`
1. `gulp`


## Tests

Tests are run through gulp, using [gulp-spawn-mocha](https://github.com/KenPowers/gulp-spawn-mocha).

`gulp tests`


## Coding Style

[View ESLint config](https://www.npmjs.com/package/eslint-config-warner)
