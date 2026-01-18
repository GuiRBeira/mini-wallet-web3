// src/config/networks.js
export const NETWORKS = {
  mainnet: {
    chainId: '0x1', // REDE NORMAL DA ETHERIUM
    name: 'Ethereum Mainnet',
    color: 'blue',
    isTestnet: false
  },
  sepolia: {
    chainId: '0xaa36a7', // 11155111
    name: 'Sepolia Testnet',
    color: 'purple',
    isTestnet: true
  },
  // Adicionei Amoy (Polygon) só para ver como seria uma rede não-ETH
  amoy: {
    chainId: '0x13882', // 80002
    name: 'Polygon Amoy',
    color: 'pink',
    isTestnet: true
  }
}