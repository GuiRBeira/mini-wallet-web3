import { 
  Menu, MenuButton, MenuList, MenuItem, Button, Text, Circle, HStack 
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { NETWORKS } from '../config/network'

export const NetworkSwitcher = ({ currentChainId, onSwitch }) => {
  
  // Converte o chainId numérico/string que vem do hook para Hex para comparar
  const currentHex = currentChainId ? `0x${BigInt(currentChainId).toString(16)}` : null

  // Encontra a rede atual na nossa config
  const activeNetwork = Object.values(NETWORKS).find(n => n.chainId === currentHex)

  return (
    <Menu>
      <MenuButton 
        as={Button} 
        rightIcon={<ChevronDownIcon />} 
        variant="outline" 
        borderColor="gray.600"
        _hover={{ bg: 'gray.700' }}
        _active={{ bg: 'gray.700' }}
        bg="gray.800"
        color="white"
        size="sm"
      >
        <HStack>
            {/* Bolinha colorida indicando status */}
            <Circle size="8px" bg={activeNetwork?.color || 'gray.500'} />
            <Text>{activeNetwork?.name || 'Rede Desconhecida'}</Text>
        </HStack>
      </MenuButton>
      
      <MenuList bg="gray.800" borderColor="gray.600">
        {Object.values(NETWORKS).map((network) => (
          <MenuItem 
            key={network.chainId}
            onClick={() => onSwitch(network.chainId)}
            bg="gray.800"
            _hover={{ bg: 'gray.700' }}
            color={network.chainId === currentHex ? network.color + '.300' : 'gray.300'}
            fontWeight={network.chainId === currentHex ? 'bold' : 'normal'}
          >
            <HStack>
                <Circle size="6px" bg={network.color + '.400'} />
                <Text>{network.name}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}