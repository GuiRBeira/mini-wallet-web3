import { Button } from '@chakra-ui/react'

export function DisconnectButton({ onClick }) {
  return (
    <Button
      colorScheme="red"
      variant="outline"
      onClick={onClick}
      mt={4}
      _hover={{
        bg: 'red.500',
        color: 'white',
        borderColor: 'white',
        transform: 'translateY(-1px)',
        boxShadow: 'md',
      }}
      _active={{
        bg: 'red.700',
        transform: 'translateY(0px)',
        boxShadow: 'sm',
      }}
      transition="all 0.4s ease" // corrigindo o "hease" :)
    >
      Desconectar Carteira
    </Button>
  )
}
