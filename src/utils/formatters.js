// src/utils/formatters.js
export const formatAddress = (addr) => {
  if (!addr) return 'Não conectado'
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}

export const formatSmartEth = (valueString) => {
  const value = parseFloat(valueString)
  
  // 1. Se for zero absoluto
  if (value === 0) return '0'

  // 2. Se for muito pequeno (tipo poeira ou gas)
  // Mostra até 8 casas decimais, mas o parseFloat remove os zeros à direita
  if (value < 0.001) {
    return parseFloat(value.toFixed(8)).toString()
  }

  // 3. Se for valor normal
  // Mostra 4 casas, mas remove zeros inúteis (ex: 0.5000 vira 0.5)
  return parseFloat(value.toFixed(4)).toString()
}