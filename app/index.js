const fsp = require('fs').promises
const path = require('path')
const { updateRepositoryReadme, getReadmeSHA } = require('./utils/repo')
const README_TEMPLATE_PATH = path.join(__dirname, './templates/README.md')

/**
 *  Read the template from markdown file
 */
const getReadmeTemplate = async () => {
  return fsp.readFile(README_TEMPLATE_PATH, 'utf8')
}

/**
 *  TODO: Render out readme content
 */
const buildReadmeContent = async context => {
  const template = await getReadmeTemplate()
  // render
}

module.exports = async options => {
  //update to github
  let readmeContent = await getReadmeTemplate()
  let appendContent = new Date()
  let content = readmeContent + appendContent
  const contentBuffer = await Buffer.from(unescape(content), 'utf8').toString(
    'base64'
  )
  let sha = await getReadmeSHA(options)
  await updateRepositoryReadme(options, { contentBuffer, sha })
}
