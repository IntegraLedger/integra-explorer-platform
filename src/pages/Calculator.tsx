import { Container, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { DocumentProcessor } from '@/components/document/DocumentProcessor';

export function Calculator() {
  const headingColor = useColorModeValue('gray.800', 'white');
  const subheadingColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container maxW="container.xl">
      <VStack spacing={8} py={8}>
        <VStack spacing={2}>
          <Heading size="lg" color={headingColor}>Document Verification</Heading>
          <Text color={subheadingColor} textAlign="center">
            Upload a document to calculate its SHA256 hash and search for it on the blockchain
          </Text>
        </VStack>

        <DocumentProcessor />
      </VStack>
    </Container>
  );
}