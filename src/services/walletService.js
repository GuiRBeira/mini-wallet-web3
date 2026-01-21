// src/services/walletService.js
import {
  BrowserProvider,
  formatEther,
  parseEther,
  isAddress
} from 'ethers'
import { getEthereum } from '../lib/ethereum'

export const createProvider = () => {
  const ethereum = getEthereum()
  if (!ethereum) throw new Error('MetaMask não está disponível')
  return new BrowserProvider(ethereum)
}

export const fetchBalance = async (address, provider) => {
  try {
    const balanceWei = await provider.getBalance(address)
    const balanceEth = formatEther(balanceWei)
    return parseFloat(balanceEth).toFixed(4)
  } catch (error) {
    // 1. O "Pulo do Gato": Ignorar erro de mudança de rede
    if (error.code === 'NETWORK_ERROR' && error.event === 'changed') {
       return '...' 
    }
    console.error('Erro ao buscar saldo:', error)
    return '0.0000'
  }
}

/**
 * Lê estado atual da carteira a partir de um provider.
 * Retorna só os dados “puros”, sem mexer com React.
 */
export const buildWalletSnapshot = async (provider) => {
  const network = await provider.getNetwork()
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  const balance = await fetchBalance(address, provider)

  return {
    address,
    chainId: network.chainId.toString(),
    balance,
  }
}

export const estimateTransactionGas = async (provider, toAddress, amountEth) => {
  if (!isAddress(toAddress) || !amountEth || parseFloat(amountEth) <= 0) return null

  try {
    const signer = await provider.getSigner()
    const gasLimit = await signer.estimateGas({
      to: toAddress,
      value: parseEther(amountEth)
    })

    const feeData = await provider.getFeeData()
    // Fallback seguro se o gasPrice vier null (acontece em algumas L2s)
    const price = feeData.gasPrice || 0n
    const cost = gasLimit * price

    return cost // Retorna BigInt puro
  } catch (error) {
    console.warn("Falha na estimativa de gas:", error)
    throw error
  }
}

export const executeTransaction = async (provider, toAddress, amountEth) => {
  const signer = await provider.getSigner()

  // O Ethers v6 popula automaticamente o gasLimit e gasPrice se omitidos
  const tx = await signer.sendTransaction({
    to: toAddress,
    value: parseEther(amountEth)
  })

  return tx // Retorna o objeto da transação (com .wait())
}