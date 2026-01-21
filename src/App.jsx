import { Container, VStack, Heading, Box, HStack, Spacer, SimpleGrid } from '@chakra-ui/react';
import { useWallet } from './hooks/useWallet';
import { LoginButton } from './components/LoginButton';
import { WalletInfo } from './components/WalletInfo';
import { TransferForm } from './components/TransferForm';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import { TransactionHistory } from './components/TransactionHistory';

function App() {
  // Pegamos o switchNetwork do hook
  const { wallet, connectWallet, disconnectWallet, isConnecting, refreshBalance, switchNetwork } = useWallet();

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} minH="100vh" bg="gray.900" py={12} px={6}>

      <Box minH="100vh" bg="gray.900" py={12}>
        <Container maxW="container.sm" centerContent>
          <VStack spacing={8} w="100%">

            {/* HEADER: Título + Switcher */}
            <HStack w="100%" spacing={4}>
              <Heading as="h1" size="xl" textStyle="gradientTitle">
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
                <Box layerStyle="glassCard">
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

                  <Box layerStyle="glassCard">
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
      <Box minH="100.vh" bg="gray.850" py={12}>
        <Container maxW="container.sm" centerContent>
          <TransactionHistory
            address={wallet.address}
            isConnected={wallet.isConnected}
            chainId={wallet.chainId}
          />
        </Container>
      </Box>
    </SimpleGrid>
  );
}

export default App;