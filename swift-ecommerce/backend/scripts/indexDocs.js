// Ejecutar con: node scripts/indexDocs.js
// Requiere ChromaDB en marcha: docker run -p 8000:8000 chromadb/chroma
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { ChromaClient } = require('chromadb')
const { DefaultEmbeddingFunction } = require('@chroma-core/default-embed')

const COLLECTION_NAME = 'swift_studio_docs'
const DOCS_DIR = path.join(__dirname, '../data/docs')
const CHUNK_MAX_CHARS = 600

function chunkByParagraph(text, source) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)
    .reduce((acc, paragraph) => {
      // Si el párrafo es muy largo, lo dividimos por oraciones
      if (paragraph.length <= CHUNK_MAX_CHARS) {
        acc.push(paragraph)
      } else {
        const sentences = paragraph.split(/(?<=[.!?])\s+/)
        let current = ''
        for (const sentence of sentences) {
          if ((current + ' ' + sentence).length > CHUNK_MAX_CHARS && current) {
            acc.push(current.trim())
            current = sentence
          } else {
            current += (current ? ' ' : '') + sentence
          }
        }
        if (current.trim()) acc.push(current.trim())
      }
      return acc
    }, [])
    .map((content, i) => ({
      id: `${source}_${i}`,
      content,
      source,
    }))
}

async function main() {
  const embeddingFunction = new DefaultEmbeddingFunction()
  const client = new ChromaClient({
    host: process.env.CHROMA_HOST || 'localhost',
    port: parseInt(process.env.CHROMA_PORT) || 8000,
  })

  // Borrar colección existente para re-indexar desde cero
  try {
    await client.deleteCollection({ name: COLLECTION_NAME })
    console.log(`Colección '${COLLECTION_NAME}' eliminada para re-indexar.`)
  } catch (_) {
    // No existía — ignorar
  }

  const collection = await client.createCollection({
    name: COLLECTION_NAME,
    embeddingFunction,
  })
  console.log(`Colección '${COLLECTION_NAME}' creada.`)

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'))
  let totalChunks = 0

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file)
    const text = fs.readFileSync(filePath, 'utf8')
    const chunks = chunkByParagraph(text, file)

    await collection.add({
      ids: chunks.map((c) => c.id),
      documents: chunks.map((c) => c.content),
      metadatas: chunks.map((c) => ({ source: c.source })),
    })

    console.log(`  ${file}: ${chunks.length} fragmentos indexados`)
    totalChunks += chunks.length
  }

  console.log(`\nTotal: ${files.length} documentos, ${totalChunks} fragmentos en '${COLLECTION_NAME}'.`)
}

main().catch((err) => {
  console.error('Error al indexar documentos:', err.message)
  process.exit(1)
})
