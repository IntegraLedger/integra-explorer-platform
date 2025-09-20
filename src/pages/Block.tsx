import {
  Container,
  Box,
  Heading,
  VStack,
  Text,
  Divider,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useBlockTransactions } from '@/hooks/useTransactions';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { formatters } from '@/utils/formatters';

export function Block() {
  const { blockNumber } = useParams<{ blockNumber: string }>();
  const { data, isLoading, error } = useBlockTransactions(blockNumber || '');

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return (
      <Container maxW="container.xl">
        <Center py={10}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container maxW="container.xl">
        <Alert status="error">
          <AlertIcon />
          {error?.message || 'Block not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <VStack spacing={6} align="stretch">
        <Box bg={bg} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Block #{formatters.formatNumber(data.blockNumber)}</Heading>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500">Chain ID</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {data.chainId}
                </Text>
              </VStack>

              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500">Timestamp</Text>
                <Text fontSize="sm">
                  {data.timestamp ? formatters.formatDate(data.timestamp) : 'N/A'}
                </Text>
              </VStack>

              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500">Transaction Count</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatters.formatNumber(data.transactionCount)}
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Transactions ({data.transactions.length})
          </Heading>

          {data.transactions.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {data.transactions.map((tx) => (
                <TransactionCard key={tx.hash} transaction={tx} />
              ))}
            </SimpleGrid>
          ) : (
            <Text color="gray.500" textAlign="center" py={8}>
              No transactions in this block
            </Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
}