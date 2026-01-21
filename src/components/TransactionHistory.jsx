// src/components/TransactionHistory.jsx
import {
  Box,
  VStack,
  Text,
  HStack,
  Badge,
  Link,
  Icon,
  Heading,
  Spinner,
  Center
} from '@chakra-ui/react'
import {
  ExternalLinkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RepeatIcon,
  WarningIcon
} from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { fetchTransactionHistory } from '../services/historyService'
import { getNetworkName, getNetworkColor } from '../config/networks'
import { formatSmartEth } from '../utils/formatters'

export const TransactionHistory = ({ address, chainId, isConnected }) => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Carrega quando conecta ou muda de conta
  useEffect(() => {
    const loadHistory = async () => {
      if (!address || !chainId || !isConnected) return

      setIsLoading(true)
      try {
        const txs = await fetchTransactionHistory(address, chainId)
        setHistory(txs)
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [address, isConnected, chainId])

  // Se não estiver conectado, mostra aviso discreto
  if (!isConnected) {
    return (
      <Box p={6} textAlign="center" color="gray.500" borderWidth="1px" borderColor="gray.700" borderRadius="lg" borderStyle="dashed">
        <Text fontSize="sm">Conecte a carteira para ver o histórico.</Text>
      </Box>
    )
  }
  const networkName = getNetworkName(chainId)
  const networkColor = getNetworkColor(chainId)
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="lg"
      p={4}
      bg="gray.800"
      h="full"
      maxH="500px"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { width: '6px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.700',
          borderRadius: '24px'
        },
      }}
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md" color="gray.300">Histórico</Heading>
        {/* Badge indicando que é da Sepolia (pois o Etherscan é por rede) */}
        <Badge colorScheme={networkColor} fontSize="sm">
          {networkName}
        </Badge>
      </HStack>

      {isLoading ? (
        <Center py={10}><Spinner color="purple.500" /></Center>
      ) : history.length === 0 ? (
        <Text
          color="gray.500"
          textAlign="center"
          mt={4}>Nenhuma transação encontrada.</Text>
      ) : (
        <VStack spacing={3} align="stretch">
          {history.map((tx) => (
            <Box
              layerStyle="glassCard"
              h="full"
              maxH="500px"
              overflowY="auto"
            >
              <HStack justify="space-between">
                <HStack>
                  {/* Ícone de Seta (Vermelha=Saiu, Verde=Entrou) */}
                  <CircleIcon type={tx.type} isError={tx.isError} />

                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="bold" color="white">
                      {tx.type === 'self' ? 'Auto-envio' : (tx.type === 'send' ? 'Enviou' : 'Recebeu')}
                      {tx.isError && <Badge ml={2} colorScheme="red" fontSize="xs">Falha</Badge>}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {new Date(tx.timeStamp).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>

                <VStack align="end" spacing={0}>
                  <Text fontWeight="bold" color={
                    tx.type === 'self'
                      ? 'yellow.300' // Auto-envio é neutro financeiramente (tirando o gas)
                      : (tx.type === 'send' ? 'white' : 'green.300')}>
                    {/* Se for self, não precisa de sinal + ou - , claramente porque nao gastou nem ganhou :) */}
                    {tx.type === 'self' ? '' : (tx.type === 'send' ? '-' : '+')}
                    {formatSmartEth(tx.value)} ETH
                  </Text>
                  <Link
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    isExternal
                    fontSize="xs"
                    color="purple.300"
                    _hover={{ textDecoration: 'none', color: 'purple.200' }}
                  >
                    Explorer <ExternalLinkIcon mx="2px" />
                  </Link>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}

// Pequeno helper visual para o ícone redondo
const CircleIcon = ({ type, isError }) => {
  let bg, color, icon

  if (isError) {
    bg = 'red.900'
    color = 'red.300'
    icon = null // ou WarningIcon
  } else if (type === 'self') {
    // Estilo para Auto-envio (Roxo/Neutro)
    bg = 'purple.900'
    color = 'purple.300'
    icon = RepeatIcon
  } else if (type === 'send') {
    bg = 'gray.600'
    color = 'gray.300'
    icon = ArrowUpIcon
  } else {
    bg = 'green.900'
    color = 'green.300'
    icon = ArrowDownIcon
  }
  return (
    <Center w="32px" h="32px" bg={bg} borderRadius="full" color={color}>
      <Icon as={icon} boxSize={type === 'self' ? 4 : 5} />
    </Center>
  )
}