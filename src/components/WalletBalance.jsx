import {
  Box,
  HStack,
  Heading,
  Text,
  IconButton
} from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { formatSmartEth } from '../utils/formatters'

export function WalletBalance({ balance, onRefresh }) {
  return (
    <Box>
      <Text color="gray.400" fontSize="sm">
        Saldo
      </Text>
      <HStack>
        <Heading size="lg" color="green.400">
          {formatSmartEth(balance)} ETH
        </Heading>
        <IconButton
          aria-label="Atualizar saldo"
          icon={<RepeatIcon />}
          size="sm"
          onClick={onRefresh}
        />
      </HStack>
    </Box>
  )
}
