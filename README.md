# 20ds-server

Backend for 20 Day Stranger



## Stack

- [NodeJS](http://nodejs.org/)
- [Express](https://github.com/strongloop/express)
- [MongoDB](http://www.mongodb.org/) with [Mongoose](https://github.com/LearnBoost/mongoose)
- [Gulp](http://gulp.com/)
- [Mocha](https://github.com/mochajs/mocha) with [Supertest](https://github.com/tj/supertest)

## Local Setup

### Prerequisites

1. [Homebrew](http://brew.sh/)
	- `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
1. [NodeJS](http://nodejs.org/)
	- `brew install node`
1. [Gulp](http://gulp.com/)
	- `npm install --global gulp`
1. [MongoDB](http://www.mongodb.org/)
	- `brew install mongodb`

### Start Up
1. Set ENV variables.
	- NODE_ENV = development
1. `npm install`
1. `gulp`

## Tests

Tests are run through gulp, using [gulp-spawn-mocha](https://github.com/KenPowers/gulp-spawn-mocha).

`gulp tests`


## Coding Style

[squint-style](https://github.com/RyanWarner/squint-style)