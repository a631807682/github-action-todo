const path = require('path')
const { updateRepositoryReadme, getReadmeSHA } = require('./utils/repo')
const { buildReadmeContent } = require('./utils/compiler')

module.exports = async options => {
  //update to github
  let dateTime = new Date()
  let readmeContent = await buildReadmeContent({ dateTime })
  const contentBuffer = await Buffer.from(
    unescape(readmeContent),
    'utf8'
  ).toString('base64')
  let sha = await getReadmeSHA(options)
  await updateRepositoryReadme(options, { contentBuffer, sha })
}
