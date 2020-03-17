#!/usr/bin/env node

const program = require('commander')
const PKG_VERSION = require('../package.json').version

program
  .version(PKG_VERSION)
  .requiredOption('-u, --username <username>', 'GitHub username')
  .requiredOption('-t, --token <token>', 'GitHub token')
  .requiredOption('-r, --repo <repo>', 'repository name')
  .action(async cmd => {
    const options = cleanArgs(cmd)
    await require('./index.js')(options)
  })

program.parse(process.argv)

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
