import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSearch } from '@/hooks/useSearch';

export function QR() {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();
  const { search, isSearching, searchResults, searchError } = useSearch();

  const secondaryText = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (hash) {
      // Trigger search with the integra hash
      search({ query: hash });
    }
  }, [hash, search]);

  useEffect(() => {
    // When search completes and we have results, navigate to the transaction
    if (searchResults && searchResults.length > 0 && !isSearching) {
      const result = searchResults[0];

      if (result.type === 'transaction' && result.result && 'transactions' in result.result) {
        // Navigate to the first transaction found
        if (result.result.transactions.length > 0) {
          navigate(`/tx/${result.result.transactions[0].hash}`, { replace: true });
        }
      } else if (result.type === 'not_found') {
        // Stay on this page to show the error
      }
    }
  }, [searchResults, isSearching, navigate]);

  if (isSearching) {
    return (
      <Center minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="3px" />
          <Text color={secondaryText}>Searching for document...</Text>
        </VStack>
      </Center>
    );
  }

  if (searchError) {
    return (
      <Box maxW="600px" mx="auto" mt={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">Search Failed</Text>
            <Text fontSize="sm">{searchError.message || 'Unable to search for this document'}</Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  if (searchResults && searchResults.length > 0 && searchResults[0].type === 'not_found') {
    return (
      <Box maxW="600px" mx="auto" mt={8}>
        <Alert status="info" borderRadius="lg" bg="blue.50" borderColor="blue.200" borderWidth="1px">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">Document Not Found (Yet)</Text>
            <Text fontSize="sm">No registration found for hash: {hash}</Text>
            <Text fontSize="xs" color={secondaryText}>
              Important note: Depending on the blockchain and network congestion, transaction confirmations can be delayed for several minutes.
            </Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  // Still searching or waiting for navigation
  return (
    <Center minH="50vh">
      <VStack spacing={4}>
        <Spinner size="xl" color="purple.500" thickness="3px" />
        <Text color={secondaryText}>Loading document details...</Text>
      </VStack>
    </Center>
  );
}