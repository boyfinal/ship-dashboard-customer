export function isEmail(val) {
  const re = /^[a-z0-9A-Z_.-]{1,32}@[a-z0-9A-Z-_]{2,}(\.[a-z0-9A-Z]{2,7}){1,2}$/i
  return re.test(val)
}

export function isPhone(val) {
  const re = /^[+]?[0-9]{1,20}$/
  return re.test(val)
}

export function isAccount(val) {
  const re = /^[A-Za-z0-9-_]*$/
  return re.test(val)
}
