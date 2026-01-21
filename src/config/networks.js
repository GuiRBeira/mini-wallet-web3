// src/config/networks.js

// Definimos tudo em um só lugar:
export const NETWORKS = {
  mainnet: {
    key: 'mainnet',
    chainId: 1,
    chainIdHex: '0x1',
    name: 'Ethereum Mainnet',
    color: 'blue',
    isTestnet: false,
  },
  sepolia: {
    key: 'sepolia',
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    name: 'Sepolia Testnet',
    color: 'purple',
    isTestnet: true,
  },
  amoy: {
    key: 'amoy',
    chainId: 80002,
    chainIdHex: '0x13882',
    name: 'Polygon Amoy',
    color: 'pink',
    isTestnet: true,
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
}

// Lista para facilitar buscas
const NETWORK_LIST = Object.values(NETWORKS)

/**
 * Normaliza o chainId vindo da carteira:
 * - aceita number
 * - aceita string decimal ("11155111")
 * - aceita string hex ("0xaa36a7")
 */
export const normalizeChainId = (chainId) => {
  if (chainId == null) return undefined
  if (typeof chainId === 'number') return chainId

  if (typeof chainId === 'string') {
    // hex
    if (chainId.startsWith('0x')) {
      return parseInt(chainId, 16)
    }
    // decimal
    const asNumber = Number(chainId)
    return Number.isNaN(asNumber) ? undefined : asNumber
  }

  return undefined
}

export const getNetworkFromChainId = (chainId) => {
  const normalized = normalizeChainId(chainId)
  if (normalized == null) return undefined

  return NETWORK_LIST.find((net) => net.chainId === normalized)
}

export const getNetworkName = (chainId) => {
  const net = getNetworkFromChainId(chainId)
  if (!net) return 'Desconhecida'
  return net.name
}

export const getNetworkColor = (chainId) => {
  const net = getNetworkFromChainId(chainId)
  return net?.color ?? 'gray'
}

export const isTestnet = (chainId) => {
  const net = getNetworkFromChainId(chainId)
  return !!net?.isTestnet
}
