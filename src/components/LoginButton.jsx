import { Button, Text, VStack } from '@chakra-ui/react';

export const LoginButton = ({ onConnect, isConnecting }) => {
  return (
    <VStack spacing={4}>
      <Text fontSize="lg" color="gray.600">
        Conecte sua carteira para acessar o DApp.
      </Text>
      <Button 
        colorScheme="orange" 
        size="lg" 
        onClick={onConnect}
        isLoading={isConnecting}
        loadingText="Conectando..."
        boxShadow="md"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      >
        Conectar MetaMask
      </Button>
    </VStack>
  );
};