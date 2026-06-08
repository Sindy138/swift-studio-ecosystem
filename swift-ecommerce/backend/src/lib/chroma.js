const { ChromaClient } = require('chromadb')
const { DefaultEmbeddingFunction } = require('@chroma-core/default-embed')

const COLLECTION_NAME = 'swift_studio_docs'
const embeddingFunction = new DefaultEmbeddingFunction()

let client = null
let collection = null

function getClient() {
  if (!client) {
    client = new ChromaClient({
      host: process.env.CHROMA_HOST || 'localhost',
      port: parseInt(process.env.CHROMA_PORT) || 8000,
    })
  }
  return client
}

async function getCollection() {
  if (!collection) {
    const c = getClient()
    collection = await c.getOrCreateCollection({
      name: COLLECTION_NAME,
      embeddingFunction,
    })
  }
  return collection
}

// Busca los fragmentos más relevantes para una query de texto.
// ChromaDB genera los embeddings en el servidor (requiere el servidor con sentence-transformers).
async function searchDocs(query, nResults = 3) {
  const col = await getCollection()
  const results = await col.query({ queryTexts: [query], nResults })

  const documents = results.documents?.[0] ?? []
  const metadatas = results.metadatas?.[0] ?? []

  return documents.map((doc, i) => ({
    content: doc,
    source: metadatas[i]?.source ?? 'unknown',
  }))
}

module.exports = { getClient, getCollection, searchDocs }
