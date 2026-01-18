import { 
  Box, VStack, Text, Heading, HStack, Button, 
  IconButton, Badge, useClipboard, useToast 
} from '@chakra-ui/react'
import { CheckIcon, CopyIcon, RepeatIcon } from '@chakra-ui/icons'

export function WalletInfo({ address, balance, chainId, onRefresh, onDisconnect }) {
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard(address || '')

  const getNetworkName = (chainId) => {
    if (!chainId) return 'Desconhecida'
    switch (chainId) {
      case '1': return 'Ethereum Mainnet'
      case '11155111': return 'Sepolia Testnet'
      case '5': return 'Goerli Testnet'
      default: return `Network ${chainId}`
    }
  }

  const formatAddress = (addr) => {
    if (!addr) return 'Não conectado'
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const handleCopy = () => {
    onCopy()
    toast({
      title: 'Endereço copiado!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="gray.800" boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Carteira Conectada</Heading>
          <Badge colorScheme={chainId === '11155111' ? 'purple' : 'green'} fontSize="sm">
            {getNetworkName(chainId)}
          </Badge>
        </HStack>

        <Box>
          <Text color="gray.400" fontSize="sm">Saldo</Text>
          <HStack>
            <Heading size="lg" color="green.400">
              {balance} ETH
            </Heading>
            <IconButton
              aria-label="Atualizar saldo"
              icon={<RepeatIcon />}
              size="sm"
              onClick={() => onRefresh()}
            />
          </HStack>
        </Box>

        <Box>
          <Text color="gray.400" fontSize="sm">Endereço</Text>
          <HStack>
            <Text fontFamily="mono" fontSize="md">
              {formatAddress(address)}
            </Text>
            {address && (
              <IconButton
                aria-label="Copiar endereço"
                icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                size="sm"
                onClick={handleCopy}
              />
            )}
          </HStack>
        </Box>

        <Button
          colorScheme="red"
          variant="outline"
          onClick={onDisconnect}
          mt={4}
        >
          Desconectar Carteira
        </Button>
      </VStack>
    </Box>
  )
}