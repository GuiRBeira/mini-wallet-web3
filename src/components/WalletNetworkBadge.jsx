import { Badge } from '@chakra-ui/react'
import { getNetworkName, getNetworkColor } from '../config/networks'

export function WalletNetworkBadge({ chainId }) {
  return (
    <Badge colorScheme={getNetworkColor(chainId)} fontSize="sm">
      {getNetworkName(chainId)}
    </Badge>
  )
}
