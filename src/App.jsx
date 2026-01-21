import { Container, VStack, Heading, Box, HStack, Spacer } from '@chakra-ui/react';
import { useWallet } from './hooks/useWallet';
import { LoginButton } from './components/LoginButton';
import { WalletInfo } from './components/WalletInfo';
import { TransferForm } from './components/TransferForm';
// Importe o novo componente
import { NetworkSwitcher } from './components/NetworkSwitcher'; 

function App() {
  // Pegamos o switchNetwork do hook
  const { wallet, connectWallet, disconnectWallet, isConnecting, refreshBalance, switchNetwork } = useWallet();

  return (
    <Box minH="100vh" bg="gray.900" py={12}>
      <Container maxW="container.sm" centerContent>
        <VStack spacing={8} w="100%">
          
          {/* HEADER: Título + Switcher */}
          <HStack w="100%" spacing={4}>
            <Heading as="h1" size="lg" bgGradient="linear(to-r, cyan.400, purple.500)" bgClip="text">
              Mini Wallet
            </Heading>
            <Spacer />
            
            {/* Só mostra o Switcher se estiver conectado */}
            {wallet.isConnected && (
              <NetworkSwitcher 
                currentChainId={wallet.chainId} 
                onSwitch={switchNetwork} 
              />
            )}
          </HStack>
          
          <Box w="100%">
            {!wallet.isConnected ? (
              <Box p={6} bg="gray.800" borderRadius="xl" boxShadow="xl" borderWidth="1px" borderColor="gray.700">
                <LoginButton 
                  onConnect={connectWallet} 
                  isConnecting={isConnecting} 
                />
              </Box>
            ) : (
              <VStack spacing={6} align="stretch">
                
                {/* Removemos a Badge de rede daqui de dentro do WalletInfo se quiser, 
                    ou mantém redundante, não tem problema */}
                <WalletInfo 
                  address={wallet.address}
                  balance={wallet.balance}
                  chainId={wallet.chainId}
                  onRefresh={refreshBalance}
                  onDisconnect={disconnectWallet}
                />
                
                <Box p={6} bg="gray.800" borderRadius="lg" borderWidth="1px" borderColor="gray.700">
                  <TransferForm 
                    provider={wallet.provider} 
                    onSuccess={refreshBalance}
                  />
                </Box>
              </VStack>
            )}
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}

export default App;