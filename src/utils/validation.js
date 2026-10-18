export function validateAnswer(question, value) {
  if (question.required && (!value || (Array.isArray(value) && value.length === 0))) return 'This field is required'
  if (!value) return null
  const v = question.validation
  if (v.minLength && typeof value === 'string' && value.length < v.minLength) return `Minimum ${v.minLength} characters`
  if (v.maxLength && typeof value === 'string' && value.length > v.maxLength) return `Maximum ${v.maxLength} characters`
  if (v.minValue !== null && Number(value) < v.minValue) return `Minimum value is ${v.minValue}`
  if (v.maxValue !== null && Number(value) > v.maxValue) return `Maximum value is ${v.maxValue}`
  if (v.pattern && !new RegExp(v.pattern).test(value)) return 'Invalid format'
  if (question.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'
  if (question.type === 'url' && !/^https?:\/\/.+/.test(value)) return 'Invalid URL'
  if (question.type === 'phone' && !/^\+?[\d\s-]{7,15}$/.test(value)) return 'Invalid phone number'
  return null
}
