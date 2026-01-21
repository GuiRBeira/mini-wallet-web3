import { Button } from '@chakra-ui/react'

export function DisconnectButton({ onClick }) {
  return (
    <Button
      colorScheme="red"
      variant="ghost"
      size="sm"
      width="full"
      onClick={onClick}
      mt={4}
      _hover={{
        bg: 'red.500',
        color: 'white',
        borderColor: 'white',
        transform: 'translateY(-1px)',
        boxShadow: 'md',
      }}
      transition="all 0.4s ease"
    >
      Desconectar Carteira
    </Button>
  )
}