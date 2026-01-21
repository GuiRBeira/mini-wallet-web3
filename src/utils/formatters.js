// src/utils/formatters.js
export const formatAddress = (addr) => {
  if (!addr) return 'Não conectado'
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}
