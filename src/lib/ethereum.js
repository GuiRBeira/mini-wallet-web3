// src/lib/ethereum.js

export const getEthereum = () =>
  typeof window !== 'undefined' ? window.ethereum : undefined

export const isMetaMaskInstalled = () => !!getEthereum()

export const requestAccounts = async () => {
  const ethereum = getEthereum()
  if (!ethereum) throw new Error('MetaMask não está instalado')
  return ethereum.request({ method: 'eth_requestAccounts' })
}

export const queryAccounts = async () => {
  const ethereum = getEthereum()
  if (!ethereum) throw new Error('MetaMask não está instalado')
  return ethereum.request({ method: 'eth_accounts' })
}

export const requestSwitchNetwork = async (targetChainIdDecimal) => {
  const ethereum = getEthereum()
  if (!ethereum) throw new Error('MetaMask não está instalado')

  const chainIdHex = '0x' + Number(targetChainIdDecimal).toString(16)

  return ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainIdHex }],
  })
}

export const requestAddNetwork = async (networkConfig) => {
  if (!window.ethereum) throw new Error('No crypto wallet found')

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: networkConfig.chainIdHex,
        chainName: networkConfig.name,
        rpcUrls: networkConfig.rpcUrls,
        nativeCurrency: networkConfig.nativeCurrency,
        blockExplorerUrls: networkConfig.blockExplorerUrls,
      },
    ],
  })
}