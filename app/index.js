const fs = require('fs')
const path = require('path')
const ghGot = require('gh-got')
const README_TEMPLATE_PATH = path.join(__dirname, './templates/README.md')

/**
 *  Read the template from markdown file
 */
const getReadmeTemplate = async () => {
  return fs.readFile(README_TEMPLATE_PATH)
}

/**
 *  Render out readme content
 */
const buildReadmeContent = async context => {
  const template = await getReadmeTemplate()
  // render
}

const updateRepositoryReadme = async ({ contentBuffer, sha }) => {
  const { username, repo, token = '' } = options

  await ghGot(`/repos/${username}/${repo}/contents/README.md`, {
    method: 'PUT',
    token,
    body: {
      message: message || `update readme by workflow`,
      content: contentBuffer,
      sha
    }
  })
}

const checkIfReadmeExist = async options => {
  const { username, repo, token = '' } = options

  const body = await ghGot(`/repos/${username}/${repo}/contents/README.md`, {
    token
  })

  if (body && body.sha) {
    return sha
  }
}

module.exports = async options => {
  // const readmeContent = await buildReadmeContent()
  // await writeReadmeContent(readmeContent)
}
