import { Box, VStack, HStack, Heading } from '@chakra-ui/react'
import { WalletNetworkBadge } from './WalletNetworkBadge'
import { WalletBalance } from './WalletBalance'
import { WalletAddress } from './WalletAddress'
import { DisconnectButton } from './DisconnectButton'

export function WalletInfo({ address, balance, chainId, onRefresh, onDisconnect }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="gray.800" boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Carteira Conectada</Heading>
          <WalletNetworkBadge chainId={chainId} />
        </HStack>

        <WalletBalance balance={balance} onRefresh={onRefresh} />
        <WalletAddress address={address} />
        <DisconnectButton onClick={onDisconnect} />
      </VStack>
    </Box>
  )
}
