import { useState, useEffect } from 'react'; // <--- 1. Faltava o useEffect aqui
import { 
  Box, Button, Input, FormControl, FormLabel, VStack, useToast, Heading, Text, HStack 
} from '@chakra-ui/react';
import { ethers } from 'ethers';

export const TransferForm = ({ provider, onSuccess }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(null); // Iniciar como null pra esconder quando não tiver

  const toast = useToast();

  // --- Lógica de Estimativa ---
  useEffect(() => {
    const calculateGas = async () => {
      // Se os campos não estiverem prontos, limpa a estimativa e para
      if (!amount || !ethers.isAddress(recipient)) {
        setEstimatedGas(null); 
        return;
      }

      try {
        const signer = await provider.getSigner();
        
        // 2. CORREÇÃO: O nome do método é estimateGas (presente), não estimated (passado)
        const gasLimit = await signer.estimateGas({
          to: recipient,
          value: ethers.parseEther(amount) // Isso pode falhar se amount for "0.0.1", o catch pega
        });

        const feeData = await provider.getFeeData();
        
        // Cálculo com BigInt (Funciona nativo no JS moderno/Ethers v6)
        // Se gasPrice for null (raro), fallback para 0
        const price = feeData.gasPrice || 0n;
        const cost = gasLimit * price;

        setEstimatedGas(ethers.formatEther(cost));

      } catch (error) {
        // Se der erro (ex: saldo insuficiente para gas), limpamos
        console.log("Estimativa falhou (provavelmente input incompleto):", error.message);
        setEstimatedGas(null);
      }
    };

    // Pequeno delay para não calcular a cada letra digitada (Debounce manual)
    const timer = setTimeout(calculateGas, 500);
    return () => clearTimeout(timer); // Cleanup
    
  }, [amount, recipient, provider]);

  // --- Lógica de Envio (Mantida igual) ---
  const handleTransfer = async () => {
    if (!provider) return;
    setIsLoading(true);

    try {
      if (!ethers.isAddress(recipient)) throw new Error("Endereço inválido");
      if (parseFloat(amount) <= 0) throw new Error("Valor deve ser positivo");

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      });

      toast({
        title: "Transação Enviada",
        description: "Aguardando confirmação...",
        status: "info",
        duration: 5000,
        isClosable: true
      });

      await tx.wait();

      toast({ title: "Sucesso!", status: "success", isClosable: true });
      setAmount("");
      setRecipient("");
      setEstimatedGas(null); // Limpa estimativa ao terminar
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      toast({ 
        title: "Erro", 
        description: error.reason || error.message, 
        status: "error",
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="sm" mb={4} color="gray.300">Nova Transferência</Heading>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">Destino</FormLabel>
          <Input 
            placeholder="0x..." 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)} 
            bg="gray.700" border="none" color="white"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ ring: 2, ringColor: "purple.500" }}
          />
        </FormControl>
        
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">Valor (ETH)</FormLabel>
          <Input 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            bg="gray.700" border="none" color="white"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ ring: 2, ringColor: "purple.500" }}
          />
        </FormControl>

        {estimatedGas && (
            <HStack w="full" justify="space-between">
                <Text fontSize="xs" color="gray.400">Taxa estimada (Gas):</Text>
                <Text fontSize="xs" color="yellow.300" fontWeight="bold">
                    ~ {parseFloat(estimatedGas).toFixed(6)} ETH
                </Text>
            </HStack>
        )}

        <Button 
          colorScheme="purple" 
          width="full" 
          onClick={handleTransfer}
          isLoading={isLoading}
          isDisabled={!amount || !recipient}
          mt={2}
        >
          Enviar ETH
        </Button>
      </VStack>
    </Box>
  );
};