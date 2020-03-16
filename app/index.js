const fsp = require('fs').promises
const path = require('path')
const ghGot = require('gh-got')
const README_TEMPLATE_PATH = path.join(__dirname, './templates/README.md')

/**
 *  Read the template from markdown file
 */
const getReadmeTemplate = async () => {
  return fsp.readFile(README_TEMPLATE_PATH, 'utf8')
}

/**
 *  Render out readme content
 */
const buildReadmeContent = async context => {
  const template = await getReadmeTemplate()
  // render
}

const updateRepositoryReadme = async (options, { contentBuffer, sha }) => {
  console.log(options)
  const { username, repo, token = '' } = options
  try {
    await ghGot(`/repos/${username}/${repo}/contents/README.md`, {
      method: 'PUT',
      token,
      body: {
        message: `update readme by workflow`,
        content: contentBuffer,
        sha
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const getReadmeSHA = async options => {
  const { username, repo, token = '' } = options

  try {
    const body = await ghGot(`/repos/${username}/${repo}/contents/README.md`, {
      token
    })

    if (body && body.sha) {
      return sha
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = async options => {
  // const readmeContent = await buildReadmeContent()
  // await writeReadmeContent(readmeContent)

  // test for update to github
  let sha = await getReadmeSHA(options)
  let readmeContent = await getReadmeTemplate()
  let appendContent = new Date()
  let content = readmeContent + appendContent
  const contentBuffer = await Buffer.from(unescape(content), 'utf8').toString(
    'base64'
  )
  await updateRepositoryReadme(options, { contentBuffer, sha })
  console.log('success')
}
