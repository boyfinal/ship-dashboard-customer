/**
 * Format number
 * @param val
 * @returns {*}
 */
export function formatNumber(val) {
  if (!val) {
    return 0
  }

  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Two digital
 * @param val
 * @return {*}
 */
export const formatTwoDigits = (val) => {
  if (val < 10) {
    return `0${val}`
  }

  return val
}

export const formatUnitString = (unit, quantity, extra = 's') => {
  if (quantity && quantity > 1) return unit + extra
  return unit
}

export const formatTobe = (tobe, quantity, result = 'are') => {
  if (quantity && quantity > 1) return result
  return tobe
}

/**
 * Format price
 * @param value
 * @return {string}
 */
export const formatPrice = (value) => {
  if (!value) return '$0.00'

  let val = (Math.abs(value) / 1).toFixed(2)

  if (val == 0) {
    return '$0.00'
  }

  if (value < 0) {
    return `- $${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  return `$${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const round = (value, digits = 0) => {
  digits = parseInt(digits)
  if (digits < 0) return NaN
  return +(Math.round(`${value}e+${digits}`) + `e-${digits}`)
}

export const sum = (a, b, digits = 0) => {
  if (digits < 0) return NaN

  a = Math.round(`${a}e+${digits}`)
  b = Math.round(`${b}e+${digits}`)

  return (a + b) / Number(`1e${digits}`)
}

export const subtract = (a, b, digits = 0) => {
  if (digits < 0) return NaN

  a = Math.round(`${a}e+${digits}`)
  b = Math.round(`${b}e+${digits}`)

  return (a - b) / Number(`1e${digits}`)
}

export const numFormatter = (num) => {
  if (num < 1000) {
    return num
  } else if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(2) + 'K'
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  }
}

export const formatPrice2 = (value) => {
  let val = (Math.abs(value) / 1).toFixed(2)

  if (val == 0) {
    return '$0.00'
  }

  if (value < 0) {
    return `- $${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  return `+ $${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const numberSliceTwoDecimal = (val) => {
  if (!val) return 0

  if (!('' + val).includes('.')) return +val

  const arr = ('' + val).split('.')
  const a = arr[0] ? arr[0] : 0
  const d = arr[1] ? (arr[1].length > 2 ? arr[1].slice(0, 2) : arr[1]) : '00'

  return Number(`${a}.${d}`)
}
