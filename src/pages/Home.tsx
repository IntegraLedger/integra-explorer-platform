import { VStack, Box, Heading, Text, Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';
import { TransactionGrid } from '@/components/transactions/TransactionGrid';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { useEffect } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import type { SearchResult } from '@/types/api.types';

interface HomeProps {
  selectedChain: number;
}

export function Home({ selectedChain }: HomeProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchHash = searchParams.get('search');

  const { search, isSearching, searchResults, searchError } = useSearch();

  // Handle search when searchHash changes
  useEffect(() => {
    if (!searchHash) {
      return;
    }

    // Trigger search
    search({ query: searchHash, chainId: selectedChain === 0 ? undefined : selectedChain });
  }, [searchHash, search, selectedChain]);

  const handleResultSelect = (result: SearchResult) => {
    // Navigate based on result type
    if (result.type === 'transaction' && result.result && 'transactions' in result.result) {
      if (result.result.transactions.length > 0) {
        navigate(`/tx/${result.result.transactions[0].hash}`);
      }
    }
  };

  const chainId = selectedChain === 0 ? undefined : selectedChain;

  // Show search results if we have a search query
  if (searchHash) {
    if (isSearching) {
      return (
        <Center py={10}>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="3px" />
            <Text color="gray.600">Searching for document...</Text>
          </VStack>
        </Center>
      );
    }

    if (searchResults && searchResults.length > 0) {
      const result = searchResults[0];

      // Check if we found transactions
      if (result.type === 'transaction' && result.result && 'transactions' in result.result) {
        const transactions = result.result.transactions;

        if (transactions.length > 0) {
          return (
            <VStack spacing={6} align="stretch" w="full">
              <Box>
                <Heading size="md" mb={4}>Search Results</Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Found {transactions.length} transaction{transactions.length > 1 ? 's' : ''} for hash: {searchHash}
                </Text>
                <SearchResults
                  results={searchResults}
                  error={searchError}
                  onSelect={handleResultSelect}
                />
              </Box>
            </VStack>
          );
        }
      }
    }

    // No results found
    return (
      <VStack spacing={6} align="stretch" w="full">
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">No results found</Text>
            <Text fontSize="sm">No matching document hash was found on any Integra-enabled blockchain</Text>
          </Box>
        </Alert>
        <TransactionGrid chainId={chainId} />
      </VStack>
    );
  }

  // Default view - show transaction grid
  return (
    <VStack spacing={6} align="stretch" w="full">
      <TransactionGrid chainId={chainId} />
    </VStack>
  );
}