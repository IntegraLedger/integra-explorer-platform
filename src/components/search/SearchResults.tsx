import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import type { SearchResult } from '@/types/api.types';
import { formatters } from '@/utils/formatters';

interface SearchResultsProps {
  results: SearchResult[];
  error?: Error | null;
  onSelect: (result: SearchResult) => void;
}

export function SearchResults({ results, error, onSelect }: SearchResultsProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.100', 'gray.600');

  if (error) {
    return (
      <Box
        bg={bg}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        boxShadow="lg"
      >
        <Alert status="error">
          <AlertIcon />
          {error.message || 'Search failed'}
        </Alert>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box
        bg={bg}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        boxShadow="lg"
      >
        <Text color="gray.500" textAlign="center">
          No results found
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="lg"
      maxH="500px"
      overflowY="auto"
    >
      <VStack spacing={0} align="stretch">
        {results.map((result, index) => (
          <Box key={index}>
            <Box p={4}>
              <HStack justify="space-between" mb={3}>
                <Badge colorScheme="blue" textTransform="capitalize">
                  {result.type === 'transaction' ? 'Universal Hash Search' : result.type}
                </Badge>
                {result.result && 'query' in result.result && (
                  <Text fontSize="xs" color="gray.500" fontFamily="mono">
                    {formatters.truncateHash(result.result.query)}
                  </Text>
                )}
              </HStack>

              {result.type === 'transaction' && result.result && 'totalMatches' in result.result && (
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Text fontSize="sm" fontWeight="bold">
                      Found {result.result.totalMatches} transactions
                    </Text>
                  </HStack>

                  <SimpleGrid columns={1} spacing={2}>
                    {result.result.transactions.slice(0, 3).map((tx, txIndex) => (
                      <Box
                        key={txIndex}
                        p={3}
                        bg={cardBg}
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{ bg: cardHoverBg }}
                        onClick={() => onSelect(result)}
                      >
                        <VStack align="stretch" spacing={1}>
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontFamily="mono">
                              {formatters.truncateHash(tx.hash)}
                            </Text>
                            <Badge size="sm" colorScheme="green">
                              {tx.status}
                            </Badge>
                          </HStack>

                          <HStack fontSize="xs" color="gray.500" spacing={3}>
                            <Text>Block #{tx.blockNumber}</Text>
                            <Text>•</Text>
                            <Text>{formatters.formatRelativeTime(tx.timestamp)}</Text>
                            <Text>•</Text>
                            <Text>{tx.method}</Text>
                          </HStack>

                          {tx.integraHash && (
                            <HStack fontSize="xs">
                              <Text color="gray.500">Integra:</Text>
                              <Text fontFamily="mono" color="blue.500">
                                {formatters.truncateHash(tx.integraHash)}
                              </Text>
                            </HStack>
                          )}

                          {tx.documentHash && (
                            <HStack fontSize="xs">
                              <Text color="gray.500">Document:</Text>
                              <Text fontFamily="mono" color="purple.500">
                                {formatters.truncateHash(tx.documentHash)}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>

                  {result.result.totalMatches > 3 && (
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      ... and {result.result.totalMatches - 3} more transactions
                    </Text>
                  )}
                </VStack>
              )}

              {result.type === 'block' && result.result && 'blockNumber' in result.result && (
                <VStack align="stretch" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold">
                    Block #{result.result.blockNumber}
                  </Text>
                  <HStack fontSize="xs" color="gray.500">
                    <Text>{result.result.transactionCount} transactions</Text>
                    <Text>•</Text>
                    <Text>Chain {result.result.chainId}</Text>
                  </HStack>
                </VStack>
              )}

              {result.type === 'not_found' && (
                <Text color="orange.500" fontSize="sm">
                  No results found for this query
                </Text>
              )}
            </Box>
            {index < results.length - 1 && <Divider />}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}