const ghGot = require('gh-got')
const Spinner = require('./spinner')

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

module.exports = {
  updateRepositoryReadme,
  getReadmeSHA
}
