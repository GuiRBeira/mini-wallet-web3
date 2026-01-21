import {
  Box,
  HStack,
  IconButton,
  Text,
  useClipboard,
  useToast
} from '@chakra-ui/react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { formatAddress } from '../utils/formatters'

export function WalletAddress({ address }) {
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard(address || '')

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
    <Box>
      <Text color="gray.400" fontSize="sm">
        Endereço
      </Text>
      <HStack>
        <Text fontFamily="mono" fontSize="md" color="gray.200">
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
  )
}
