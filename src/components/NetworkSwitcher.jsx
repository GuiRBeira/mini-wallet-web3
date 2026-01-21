// src/components/NetworkSwitcher.jsx
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Circle,
  HStack
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { NETWORKS, getNetworkFromChainId } from '../config/networks'

export const NetworkSwitcher = ({ currentChainId, onSwitch }) => {
  const activeNetwork = getNetworkFromChainId(currentChainId)

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
          {/* Agora vai pegar a cor certa (purple) */}
          <Circle size="8px" bg={activeNetwork?.color || 'gray.500'} />
          <Text>{activeNetwork?.name || 'Rede Desconhecida'}</Text>
        </HStack>
      </MenuButton>

      <MenuList bg="gray.800" borderColor="gray.600">
        {Object.values(NETWORKS).map((network) => {
            // Verifica se é a rede atual comparando os IDs numéricos
            const isActive = activeNetwork?.chainId === network.chainId

            return (
              <MenuItem
                key={network.chainId}
                // Passa o Hex para o switch (MetaMask prefere Hex)
                onClick={() => onSwitch(network.chainIdHex)} 
                bg="gray.800"
                _hover={{ bg: 'gray.700', color: network.color + '.300', transform: 'translateY(-2px)'}}
                color={isActive ? network.color + '.300' : 'gray.300'}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                <HStack>
                  <Circle size="6px" bg={network.color + '.400'} />
                  <Text>{network.name}</Text>
                </HStack>
              </MenuItem>
            )
        })}
      </MenuList>
    </Menu>
  )
}