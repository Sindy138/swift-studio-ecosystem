// Capa 1 y Capa 5 del doc 4_seguridad-prompts.md
// Detecta patrones típicos de prompt injection y jailbreaking antes de llegar al LLM.

const INJECTION_PATTERNS = [
  /ignora\s+(todas?\s+)?(las?\s+)?instrucciones/i,
  /olvida\s+(lo\s+que|todo|tus)/i,
  /act[uú]a\s+como\s+(si|un|una)/i,
  /jailbreak/i,
  /\bDAN\b/,
  /do\s+anything\s+now/i,
  /nuevo\s+rol/i,
  /eres\s+ahora\s+(un|una)/i,
  /<\s*system\s*>/i,
  /\[system\]/i,
  /ignore\s+(all\s+)?(previous|your)\s+instructions/i,
  /forget\s+(everything|all|your)/i,
  /override\s+(your\s+)?instructions/i,
  /pretend\s+(you\s+are|to\s+be)/i,
]

function detectPromptInjection(req, res, next) {
  const { message } = req.body
  if (!message || typeof message !== 'string') return next()

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      // Log del intento — solo metadatos, nunca el contenido completo del mensaje
      console.warn(
        `[SECURITY] Posible prompt injection — userId: ${req.user?.id} | length: ${message.length} | ruleIndex: ${INJECTION_PATTERNS.indexOf(pattern)}`
      )
      return res.status(400).json({ error: 'Mensaje rechazado por política de seguridad.' })
    }
  }

  next()
}

module.exports = { detectPromptInjection }
