const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

function authenticate(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = header.split(' ')[1]

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

async function isAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    })
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: admin access required' })
    }
    next()
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { authenticate, isAdmin }
