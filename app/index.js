const fsp = require('fs').promises
const path = require('path')
const ghGot = require('gh-got')
const Spinner = require('./utils/spinner')
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
  const { username, repo, token = '' } = options

  const spinner = new Spinner('Updating repository...')
  spinner.start()

  try {
    await ghGot(`/repos/${username}/${repo}/contents/README.md`, {
      method: 'PUT',
      token,
      body: {
        message: `docs: update readme by workflow`,
        content: contentBuffer,
        sha
      }
    })

    spinner.succeed('Update to repository successful!')
  } catch (err) {
    if (err.body) {
      spinner.fail(err.body.message)
    }
  } finally {
    spinner.stop()
  }
}

const getReadmeSHA = async options => {
  const { username, repo, token = '' } = options

  const spinner = new Spinner(`Checking if repository '${repo}' exists...`)
  spinner.start()

  try {
    const { body } = await ghGot(
      `/repos/${username}/${repo}/contents/README.md`,
      {
        token
      }
    )

    if (body && body.sha) {
      spinner.succeed('Repository found!')
      return body.sha
    }
  } catch (err) {
    if (err.body) {
      spinner.fail(err.body.message)
    }
  } finally {
    spinner.stop()
  }
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
