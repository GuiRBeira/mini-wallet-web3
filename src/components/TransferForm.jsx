// src/components/TransferForm.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Heading,
  Text,
  HStack,
  Progress
} from '@chakra-ui/react';
import { formatEther } from 'ethers'; // Único import do ethers para formatação visual
import { estimateTransactionGas, executeTransaction } from '../services/walletService';

export const TransferForm = ({ provider, onSuccess }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(null);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  // --- Lógica de Estimativa (Refatorada) ---
  useEffect(() => {
    const calculateGas = async () => {
      // Limpa se os campos estiverem vazios
      if (!amount || !recipient) {
        setEstimatedGas(null);
        return;
      }

      try {
        // Chama o Serviço (Abstração)
        const costWei = await estimateTransactionGas(provider, recipient, amount);

        if (costWei) {
          setEstimatedGas(formatEther(costWei));
        }
      } catch (error) {
        console.error("Erro ao estimar gas:", error);
        setEstimatedGas(null);
      }
    };

    const timer = setTimeout(calculateGas, 500);
    return () => clearTimeout(timer);

  }, [amount, recipient, provider]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 90) {
            clearInterval(interval);
            return oldProgress;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 90);
        })
      }, 500)
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading])

  // --- Lógica de Envio (Refatorada) ---
  const handleTransfer = async () => {
    if (!provider) {
      toast({ title: "Erro", description: "Carteira não detectada.", status: "error" });
      return;
    }
    setIsLoading(true);
    setProgress(10);
    try {
      // Chama o Serviço para executar
      const tx = await executeTransaction(provider, recipient, amount);

      toast({
        title: "Transação Enviada",
        description: "Aguardando confirmação na Blockchain...",
        status: "info",
        duration: 5000,
        isClosable: true
      });

      // Aguarda mineração
      await tx.wait();

      setProgress(100);

      toast({
        title: "Sucesso!",
        description: "Transferência confirmada.",
        status: "success",
        isClosable: true,
        duration: 5000
      });

      setTimeout(() => {
        setAmount('')
        setRecipient('')
        setIsLoading(false)
        if (onSuccess) onSuccess()
      }, 1000);

    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      console.error(error);

      // Tratamento básico de erros comuns
      let msg = error.reason || error.message || "Falha na transação";
      if (msg.includes("insufficient funds")) msg = "Saldo insuficiente para cobrir valor + gas.";

      toast({
        title: "Erro",
        description: msg,
        status: "error",
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box layerStyle="glassCard">
      <Heading size="sm" mb={4} color="gray.300">Nova Transferência</Heading>

      <VStack spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">Destino</FormLabel>
          <Input
            layerStyle="inputBase"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">Valor (ETH)</FormLabel>
          <Input
            layerStyle="inputBase"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{
              '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none', margin: 0
              }
            }}
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
        {isLoading && (
          <Box w="full">
            <Progress
              value={progress}
              size="xs" // Fininha e elegante
              colorScheme={progress === 100 ? "green" : "purple"} // Fica verde quando completa
              hasStripe // Listradinha (opcional)
              isAnimated // Animação das listras
              borderRadius="full"
            />
            <Text fontSize="xs" color="purple.300" textAlign="center" mt={1}>
              {progress >= 90 ? "Confirmando na Blockchain..." : "Enviando..."}
            </Text>
          </Box>
        )}
        <Button
          colorScheme="purple"
          width="full"
          onClick={handleTransfer}
          isLoading={isLoading}
          isDisabled={!amount || !recipient}
          mt={2}
          _hover={{ bg: "purple.600", transform: "translateY(-1px)" }}
        >
          Enviar ETH
        </Button>
      </VStack>
    </Box>
  );
};