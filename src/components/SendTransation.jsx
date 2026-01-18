import { useState } from 'react'
import { ethers } from 'ethers'
import { 
  Box, VStack, FormControl, FormLabel, Input, Button, 
  Heading, Text, useToast, Alert, AlertIcon, HStack 
} from '@chakra-ui/react'

export function SendTransaction({ provider, address }) {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('0.001')
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState('')

  const toast = useToast()

  const isValidAddress = (addr) => {
    return ethers.isAddress(addr)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!provider || !address) {
      toast({
        title: 'Erro',
        description: 'Conecte sua carteira primeiro',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (!isValidAddress(to)) {
      toast({
        title: 'Endereço inválido',
        description: 'Insira um endereço Ethereum válido',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setTxHash('')

    try {
      // Obter signer (usuário autenticado)
      const signer = await provider.getSigner()
      
      // Converter ETH para Wei
      const amountWei = ethers.parseEther(amount)
      
      // Criar transação
      const tx = {
        to,
        value: amountWei
      }

      // Enviar transação
      const transaction = await signer.sendTransaction(tx)
      setTxHash(transaction.hash)

      toast({
        title: 'Transação enviada!',
        description: 'Aguardando confirmação...',
        status: 'info',
        duration: 3000,
      })

      // Aguardar confirmação (opcional)
      const receipt = await transaction.wait()
      
      toast({
        title: 'Transação confirmada!',
        description: `Bloco: ${receipt?.blockNumber}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Limpar formulário
      setTo('')

    } catch (error) {
      console.error('Erro na transação:', error)
      
      let errorMessage = 'Erro ao enviar transação'
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Saldo insuficiente'
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transação rejeitada pelo usuário'
      } else if (error.message?.includes('network')) {
        errorMessage = 'Erro de rede. Verifique se está na Sepolia'
      }

      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="gray.800" boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Enviar ETH</Heading>
        
        {txHash && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Transação enviada!</Text>
              <Text fontSize="sm" fontFamily="mono">
                Hash: {txHash.substring(0, 10)}...
              </Text>
              <Button
                size="xs"
                mt={2}
                onClick={() => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')}
              >
                Ver no Etherscan
              </Button>
            </Box>
          </Alert>
        )}

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Use a rede Sepolia Testnet para transações de teste
        </Alert>

        <form onSubmit={handleSend}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Endereço Destino</FormLabel>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x..."
                fontFamily="mono"
                isInvalid={to !== '' && !isValidAddress(to)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Quantidade (ETH)</FormLabel>
              <HStack>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001"
                  type="number"
                  step="0.001"
                  min="0"
                />
                <Button size="sm" onClick={() => setAmount('0.001')} variant="outline">
                  0.001 ETH
                </Button>
                <Button size="sm" onClick={() => setAmount('0.01')} variant="outline">
                  0.01 ETH
                </Button>
              </HStack>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
              loadingText="Enviando..."
              isDisabled={!provider || !address}
            >
              Enviar Transação
            </Button>
          </VStack>
        </form>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Esta é uma transação real na blockchain de teste Sepolia
        </Text>
      </VStack>
    </Box>
  )
}