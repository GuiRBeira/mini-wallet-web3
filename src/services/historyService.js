// src/services/historyService.js
import { formatEther } from 'ethers'

const SEPOLIA_BASE_URL = import.meta.env.VITE_SEPOLIA_BASE_URL

export const fetchTransactionHistory = async (address, chainId) => {
    if (!address || !chainId) return []

    // Pega a chave do .env (se não tiver, vai tentar sem chave, mas é limitado)
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || ''
    const chainIdDecimal = typeof chainId === 'number' ? chainId : parseInt(chainId, 10)
    // Monta a URL para pegar as últimas transações
    const url = `${SEPOLIA_BASE_URL}?chainid=${chainIdDecimal}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`

    try {
        const response = await fetch(url)
        const data = await response.json()

        // Status '1' = Sucesso e tem dados
        if (data.status === '1') {
            return data.result.map(tx => {
                // Normalizamos para lowercase para garantir a comparação
                const myAddr = address.toLowerCase()
                const fromAddr = tx.from.toLowerCase()
                const toAddr = tx.to.toLowerCase()

                let type = 'receive'
                if (fromAddr === myAddr && toAddr === myAddr) {
                    type = 'self' // <--- NOVO TIPO
                } else if (fromAddr === myAddr) {
                    type = 'send'
                }

                return {
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: formatEther(tx.value),
                    timeStamp: parseInt(tx.timeStamp) * 1000,
                    isError: tx.isError === '1',
                    type: type // Agora pode ser 'send', 'receive' ou 'self'
                }
            })
        }

        // Status '0' com mensagem 'No transactions found' é normal para carteira nova
        if (data.message === 'No transactions found') return []
        return []
    } catch (error) {
        console.error("Erro ao buscar histórico:", error)
        return []
    }
}