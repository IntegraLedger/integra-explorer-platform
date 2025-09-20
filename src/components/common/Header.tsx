import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Container,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getAllChains } from '@/utils/chains';

const chainOptions = [
  { id: 0, name: 'All Chains', icon: null },
  ...getAllChains().map(chain => ({
    id: chain.id,
    name: chain.name,
    icon: chain.icon,
  })),
];

interface HeaderProps {
  selectedChain: number;
  onChainSelect: (chainId: number) => void;
}

export function Header({ selectedChain, onChainSelect }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logoSrc = useColorModeValue('/assets/images/integra-logo.png', '/assets/images/integra-logo-white-300.png');

  const selectedChainOption = chainOptions.find(c => c.id === selectedChain) || chainOptions[0];

  const handleLogoClick = () => {
    // Reset chain selection to "All Chains"
    onChainSelect(0);
    // Force reload the page to clear all state
    window.location.href = '/';
  };

  return (
    <Box
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={20}
      boxShadow="sm"
      h="64px"
    >
      <Container maxW="container.xl" h="full">
        <Flex h="full" alignItems="center" justifyContent="space-between">
          <HStack spacing={8}>
            <Image
              src={logoSrc}
              alt="Integra Logo"
              height="40px"
              objectFit="contain"
              cursor="pointer"
              onClick={handleLogoClick}
            />
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              <RouterLink to="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </RouterLink>
            </HStack>
          </HStack>

          <HStack spacing={4}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="sm"
                variant="outline"
              >
                <HStack spacing={2}>
                  {selectedChainOption.icon && (
                    <Image
                      src={selectedChainOption.icon}
                      alt={selectedChainOption.name}
                      height="16px"
                      width="16px"
                    />
                  )}
                  <Text>{selectedChainOption.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                {chainOptions.map((chain) => (
                  <MenuItem
                    key={chain.id}
                    onClick={() => onChainSelect(chain.id)}
                  >
                    <HStack spacing={2}>
                      {chain.icon ? (
                        <Image
                          src={chain.icon}
                          alt={chain.name}
                          height="20px"
                          width="20px"
                        />
                      ) : (
                        <Box width="20px" />
                      )}
                      <Text>{chain.name}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size="sm"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}