export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 8

export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidPhone = (phone) =>
  !phone || /^[+\d\s\-()]{7,20}$/.test(phone)
