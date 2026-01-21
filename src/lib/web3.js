// src/lib/web3.js
import {
  BrowserProvider,
  formatEther,
  getAddress,
  parseEther,
} from 'ethers'
import { getEthereum } from './ethereum'

export const createProvider = () => {
  const ethereum = getEthereum()
  if (!ethereum) throw new Error('MetaMask não está disponível')
  return new BrowserProvider(ethereum)
}

// retorna endereço com checksum ou null se inválido
export const normalizeAddress = (addr) => {
  if (!addr) return null
  try {
    return getAddress(addr.trim())
  } catch {
    return null
  }
}

export const isValidAddress = (addr) => {
  // se normalizeAddress conseguir transformar, é válido
  return normalizeAddress(addr) !== null
}

export const getCurrentChainId = async (provider) => {
  const network = await provider.getNetwork()
  return network.chainId.toString()
}

export const sendEthTransaction = async (provider, to, amountEth) => {
  if (!provider) throw new Error('Provider não disponível')

  const signer = await provider.getSigner()

  // normalizar endereço + validar de uma vez
  const normalizedTo = normalizeAddress(to)
  if (!normalizedTo) {
    throw new Error('ENDERECO_INVALIDO')
  }

  let value
  try {
    value = parseEther(amountEth.toString())
  } catch {
    throw new Error('VALOR_INVALIDO')
  }

  const txResponse = await signer.sendTransaction({
    to: normalizedTo,
    value,
  })

  const receipt = await txResponse.wait()
  return { hash: txResponse.hash, receipt }
}

export const fetchBalanceFormatted = async (address, provider) => {
  try {
    const balanceWei = await provider.getBalance(address)
    const balanceEth = formatEther(balanceWei)
    return parseFloat(balanceEth).toFixed(4)
  } catch (error) {
    console.error('Erro ao buscar saldo:', error)
    return '0.0000'
  }
}

/**
 * Lê estado atual da carteira a partir do provider.
 * Não mexe com React; só devolve dados “puros”.
 */
export const getWalletSnapshot = async (provider) => {
  const network = await provider.getNetwork()
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  const balance = await fetchBalanceFormatted(address, provider)

  return {
    address,
    chainId: network.chainId.toString(),
    balance,
  }
}
