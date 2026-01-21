// src/hooks/useWallet.js
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  isMetaMaskInstalled,
  requestAccounts,
  queryAccounts,
  requestSwitchNetwork,
  requestAddNetwork,
} from '../lib/ethereum'
import {
  createProvider,
  fetchBalance,
  buildWalletSnapshot,
} from '../services/walletService'
import { NETWORKS, getNetworkFromChainId } from '../config/networks'

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null,
    isConnected: false,
    provider: null,
    chainId: null,
    balance: '0.0000',
  })
  const NETWORK_NOT_ADDED = 4902
  const [isConnecting, setIsConnecting] = useState(true)
  const providerRef = useRef(null)

  const disconnectWallet = useCallback(() => {
    providerRef.current = null
    setWallet({
      address: null,
      isConnected: false,
      provider: null,
      chainId: null,
      balance: '0.0000',
    })
  }, [])

  const updateWalletState = useCallback(
    async (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet()
        return
      }

      try {
        const provider = createProvider()
        providerRef.current = provider

        const snapshot = await buildWalletSnapshot(provider)

        setWallet({
          ...snapshot,
          isConnected: true,
          provider,
        })
      } catch (error) {
        console.error('Falha ao atualizar estado:', error)
        disconnectWallet()
      }
    },
    [disconnectWallet],
  )

  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask não está instalado!')
      return
    }

    try {
      const accounts = await requestAccounts()
      await updateWalletState(accounts)
    } catch (error) {
      const REJECTED_CONNECTION = 4001
      if (error.code === REJECTED_CONNECTION) {
        console.error('Usuário rejeitou a conexão com a carteira.')
        return
      }
      console.error('Erro ao conectar:', error)
      throw error
    }
  }, [updateWalletState])

  const refreshBalance = useCallback(async () => {
    if (!wallet.address || !providerRef.current) return

    const newBalance = await fetchBalance(wallet.address, providerRef.current)
    setWallet((prev) => ({ ...prev, balance: newBalance }))
  }, [wallet.address])

  const switchNetwork = useCallback(
    async (targetChainIdDecimal) => {
      if (!providerRef.current || !isMetaMaskInstalled()) return
      const targetNetwork = getNetworkFromChainId(targetChainIdDecimal)
      try {
        await requestSwitchNetwork(targetChainIdDecimal)
      } catch (error) {
        if (error.code === NETWORK_NOT_ADDED || error.data?.originalError?.code === NETWORK_NOT_ADDED) {
          try {
            if (targetNetwork && targetNetwork.rpcUrls) {
              await requestAddNetwork(targetNetwork)
            } else {
              console.error('Configuração da rede alvo não encontrada ou incompleta.')
            }
          } catch (addError) {
            console.error('Erro ao adicionar nova rede:', addError)
          }
          console.error('Erro ao trocar de rede:', error)
          throw error
        }
      }
    },
    [],
  )

  // 1. AUTO-CONNECT (Roda apenas uma vez no mount)
  // Restaura a sessão se o usuário der F5
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          // Verifica contas sem abrir popup
          const accounts = await queryAccounts()
          if (accounts.length > 0) {
            await updateWalletState(accounts)
          }
        } catch (err) {
          console.error(err)
        }
      }
      setIsConnecting(false)
    }

    checkConnection()
  }, [updateWalletState])

  // 2. HEARTBEAT & SECURITY (Roda a cada 3s enquanto conectado)
  // Verifica se a carteira bloqueou e atualiza saldo
  useEffect(() => {
    if (!wallet.isConnected || !providerRef.current) return

    const checkStatus = async () => {
      try {
        // Verifica se ainda tem permissão (retorna [] se bloqueado)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        if (accounts.length === 0) {
          console.warn("MetaMask bloqueada/desconectada. Encerrando sessão...")
          disconnectWallet()
          return
        }

        // Verifica troca de conta manual
        if (accounts[0].toLowerCase() !== wallet.address?.toLowerCase()) {
          window.location.reload()
          return
        }

        // Atualiza saldo
        const newBalance = await fetchBalance(accounts[0], providerRef.current)
        setWallet((prev) => {
          if (prev.balance !== newBalance) {
            return { ...prev, balance: newBalance }
          }
          return prev
        })
      } catch (error) {
        console.error("Erro no heartbeat:", error)
      }
    }

    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [wallet.isConnected, wallet.address, disconnectWallet])

  // 3. EVENT LISTENERS (Mudança de conta/rede via extensão)
  useEffect(() => {
    if (!isMetaMaskInstalled() || typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = async (accounts) => {
      updateWalletState(accounts)
    }

    const handleChainChanged = async () => {
      try {
        const accounts = await queryAccounts()
        await updateWalletState(accounts)
      } catch (err) {
        console.error('Erro ao atualizar após mudança de rede:', err)
        disconnectWallet()
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [updateWalletState, disconnectWallet])

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchNetwork,
    isConnecting,
  }
}