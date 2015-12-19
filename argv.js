#!/usr/bin/env node

var argv = require('cmdenv')('github-auth')
  .option('--github-client-id <value>', 'Your github client id')
  .options('--github-client-secret <value>', 'Your github client secret')
  .parse(process.argv)

module.exports = {
  githubClientId: argv.githubClientId,
  githubClientSecret: argv.githubClientSecret
}
