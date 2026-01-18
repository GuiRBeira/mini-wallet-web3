// src/hooks/useWallet.js
import { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserProvider, formatEther } from 'ethers'

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null,
    isConnected: false,
    provider: null,
    chainId: null,
    balance: '0.0000'
  })
  
  const [isConnecting, setIsConnecting] = useState(true);
  const providerRef = useRef(null);

  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum !== undefined
  }, [])

  const getBalance = useCallback(async (address, provider) => {
    try {
      const balanceWei = await provider.getBalance(address)
      const balanceEth = formatEther(balanceWei)
      return parseFloat(balanceEth).toFixed(4)
    } catch (error) {
      console.error('Erro ao buscar saldo:', error)
      return '0.0000'
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    providerRef.current = null;
    setWallet({
      address: null,
      isConnected: false,
      provider: null,
      chainId: null,
      balance: '0.0000'
    })
  }, [])

  const updateWalletState = useCallback(async (accounts) => {
    if (accounts.length === 0) {
        disconnectWallet();
        return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      providerRef.current = provider;
      const network = await provider.getNetwork()
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const balance = await getBalance(address, provider)

      setWallet({
        address,
        isConnected: true,
        provider,
        chainId: network.chainId.toString(),
        balance: balance
      })
    } catch (error) {
      console.error("Falha ao atualizar estado:", error)
      disconnectWallet()
    }
  }, [getBalance, disconnectWallet])

  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask não está instalado!')
      return
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
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
  }, [isMetaMaskInstalled, updateWalletState])
  
  const refreshBalance = useCallback(async () => {
    if (!wallet.address || !providerRef.current) return;

    const newBalance = await getBalance(wallet.address, providerRef.current)
    setWallet(prev => ({ ...prev, balance: newBalance }))
  }, [wallet.address, getBalance])

  const switchNetwork = useCallback(async (targetChainIdDecimal) => {
    if (!providerRef.current || !isMetaMaskInstalled()) return

    try {
      const chainIdHex = '0x' + Number(targetChainIdDecimal).toString(16)
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
    } catch (error) {
      const NETWORK_NOT_ADDED = 4902
      if (error.code === NETWORK_NOT_ADDED) {
        console.error('Essa rede não está adicionada no MetaMask.')
      }
      console.error('Erro ao trocar de rede:', error)
      throw error
    }
  }, [isMetaMaskInstalled])

  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
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
  }, [isMetaMaskInstalled, updateWalletState])

  useEffect(() => {
    if (!isMetaMaskInstalled()) return
    const handleAccountsChanged = async (accounts) => {
      updateWalletState(accounts)
    }
    const handleChainChanged = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts'})
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
  }, [isMetaMaskInstalled, updateWalletState, disconnectWallet])

  useEffect(() => {
    if(!wallet.isConnected || !providerRef.current || !wallet.address) return

    const interval = setInterval(async () => {
      const newBalance = await getBalance(wallet.address, providerRef.current)
      setWallet(prev => {
        if(prev.balance !== newBalance){
          return {...prev, balance: newBalance }
        }
        return prev
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [wallet.isConnected, wallet.address, getBalance])
  return {
    wallet,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchNetwork,
    isConnecting,
  }
}