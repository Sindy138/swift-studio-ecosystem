const { Langfuse } = require('langfuse')

let _client = null

function getLangfuse() {
  if (_client) return _client
  if (!process.env.LANGFUSE_SECRET_KEY || !process.env.LANGFUSE_PUBLIC_KEY) return null

  _client = new Langfuse({
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
  })

  return _client
}

module.exports = { getLangfuse }
