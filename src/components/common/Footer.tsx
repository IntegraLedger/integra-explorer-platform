import {
  Box,
  Container,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export function Footer() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bg} borderTop="1px" borderColor={borderColor} mt="auto">
      <Container maxW="container.xl" py={8}>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          © 2025 Integra Ledger
        </Text>
      </Container>
    </Box>
  );
}