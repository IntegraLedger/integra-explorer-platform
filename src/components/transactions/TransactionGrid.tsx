import {
  Box,
  Heading,
  Button,
  HStack,
  VStack,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Icon,
  Tooltip,
  Image,
  Show,
  Hide,
  Divider,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FiActivity } from 'react-icons/fi';

import { useTransactions } from '@/hooks/useTransactions';
import * as formatters from '@/utils/formatters';
import { getChainConfig } from '@/utils/chains';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransactionGridProps {
  chainId?: number;
}

export function TransactionGrid({ chainId }: TransactionGridProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTransactions(page, 20, chainId);
  const navigate = useNavigate();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const integraHashColor = '#3B54B9';
  const secondaryText = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const theadBg = useColorModeValue('gray.50', 'gray.900');

  if (isLoading) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="3px" />
          <Text color={secondaryText}>Loading transactions...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        status="error"
        borderRadius="lg"
        border="1px solid"
        borderColor="red.200"
      >
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">Failed to Load Transactions</Text>
          <Text fontSize="sm" color={secondaryText}>
            {error.message || 'Unable to fetch transaction data'}
          </Text>
        </VStack>
      </Alert>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Box
        bg={bg}
        p={8}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Icon as={FiActivity} boxSize={12} color={secondaryText} />
          <Text color={secondaryText} fontSize="lg">No transactions found</Text>
          <Text color={secondaryText} fontSize="sm">
            Transactions will appear here once they're processed
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      p={{ base: 4, md: 6 }}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      boxShadow="md"
    >
      <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
        <Heading size={{ base: 'md', md: 'lg' }} color={headingColor}>
          Recent Registrations
        </Heading>

        {/* Desktop Table View */}
        <Show above="md">
          <Box
            overflowX="auto"
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
          >
            <Table variant="simple" size="sm">
              <Thead bg={theadBg}>
                <Tr>
                  <Th color={secondaryText} fontWeight="semibold">Integra Hash</Th>
                  <Th color={secondaryText} fontWeight="semibold">Blockchain</Th>
                  <Th color={secondaryText} fontWeight="semibold">Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.items.map((tx) => (
                  <Tr
                    key={tx.hash}
                    _hover={{
                      bg: hoverBg,
                      transform: 'translateX(2px)',
                      transition: 'all 0.2s',
                    }}
                    cursor="pointer"
                    onClick={() => navigate(`/tx/${tx.hash}`)}
                  >
                    <Td>
                      <Tooltip label={tx.integraHash || 'No Integra Hash'} placement="top">
                        <Text
                          fontFamily="mono"
                          fontSize="sm"
                          color={integraHashColor}
                          maxW="300px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {tx.integraHash || '-'}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      {(() => {
                        const chainConfig = getChainConfig(tx.chainId);
                        if (chainConfig) {
                          return (
                            <HStack spacing={2}>
                              <Image
                                src={chainConfig.icon}
                                alt={chainConfig.name}
                                height="16px"
                                width="16px"
                              />
                              <Text fontSize="sm" fontWeight="medium">
                                {chainConfig.name}
                              </Text>
                            </HStack>
                          );
                        }
                        return (
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            variant="subtle"
                          >
                            {formatters.formatters.getChainName(tx.chainId)}
                          </Badge>
                        );
                      })()}
                    </Td>
                    <Td>
                      <Text fontSize="sm" color={secondaryText}>
                        {tx.timestamp ? formatters.formatters.formatDateTime(tx.timestamp) : '-'}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Show>

        {/* Mobile Card View */}
        <Hide above="md">
          <VStack spacing={3} align="stretch">
            {data.items.map((tx) => (
              <Box
                key={tx.hash}
                p={4}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                bg={bg}
                cursor="pointer"
                onClick={() => navigate(`/tx/${tx.hash}`)}
                _hover={{
                  borderColor: accentColor,
                  boxShadow: 'sm',
                }}
                transition="all 0.2s"
              >
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex="1">
                      <Text fontSize="xs" color={secondaryText} fontWeight="semibold">
                        INTEGRA HASH
                      </Text>
                      <Text
                        fontFamily="mono"
                        fontSize="sm"
                        color={integraHashColor}
                        wordBreak="break-all"
                        noOfLines={2}
                      >
                        {tx.integraHash || '-'}
                      </Text>
                    </VStack>
                    {(() => {
                      const chainConfig = getChainConfig(tx.chainId);
                      if (chainConfig) {
                        return (
                          <HStack spacing={1}>
                            <Image
                              src={chainConfig.icon}
                              alt={chainConfig.name}
                              height="20px"
                              width="20px"
                            />
                            <Text fontSize="xs" fontWeight="medium">
                              {chainConfig.name}
                            </Text>
                          </HStack>
                        );
                      }
                      return (
                        <Badge
                          colorScheme="blue"
                          fontSize="xs"
                          variant="subtle"
                        >
                          {formatters.formatters.getChainName(tx.chainId)}
                        </Badge>
                      );
                    })()}
                  </HStack>
                  <Divider />
                  <Text fontSize="xs" color={secondaryText}>
                    {tx.timestamp ? formatters.formatters.formatDateTime(tx.timestamp) : '-'}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </Hide>

        {/* Desktop Pagination */}
        <Show above="md">
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color={secondaryText}>
              Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, data.pagination.total)} of {data.pagination.total}
            </Text>

            <HStack spacing={2}>
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                isDisabled={page === 1}
                size="sm"
                leftIcon={<ChevronLeftIcon />}
                variant="outline"
                _hover={{ bg: hoverBg }}
              >
                Previous
              </Button>

              <HStack spacing={1}>
                {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      size="sm"
                      variant={page === pageNum ? 'solid' : 'ghost'}
                      colorScheme={page === pageNum ? 'purple' : 'gray'}
                      minW="10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {data.pagination.totalPages > 5 && (
                  <>
                    <Text color={secondaryText}>...</Text>
                    <Button
                      onClick={() => setPage(data.pagination.totalPages)}
                      size="sm"
                      variant={page === data.pagination.totalPages ? 'solid' : 'ghost'}
                      colorScheme={page === data.pagination.totalPages ? 'purple' : 'gray'}
                      minW="10"
                    >
                      {data.pagination.totalPages}
                    </Button>
                  </>
                )}
              </HStack>

              <Button
                onClick={() => setPage(p => p + 1)}
                isDisabled={page >= data.pagination.totalPages}
                size="sm"
                rightIcon={<ChevronRightIcon />}
                variant="outline"
                _hover={{ bg: hoverBg }}
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </Show>

        {/* Mobile Pagination */}
        <Hide above="md">
          <VStack spacing={3}>
            <Text fontSize="xs" color={secondaryText} textAlign="center">
              Page {page} of {data.pagination.totalPages} • {data.pagination.total} total
            </Text>
            <HStack spacing={2} justify="center">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                isDisabled={page === 1}
                size="sm"
                leftIcon={<ChevronLeftIcon />}
                variant="outline"
              >
                Prev
              </Button>
              <HStack spacing={1}>
                {Array.from({ length: Math.min(3, data.pagination.totalPages) }, (_, i) => {
                  const pageNum = page - 1 + i;
                  if (pageNum < 1 || pageNum > data.pagination.totalPages) {
                    return null;
                  }
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      size="sm"
                      variant={page === pageNum ? 'solid' : 'ghost'}
                      colorScheme={page === pageNum ? 'purple' : 'gray'}
                      minW="8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </HStack>
              <Button
                onClick={() => setPage(p => p + 1)}
                isDisabled={page >= data.pagination.totalPages}
                size="sm"
                rightIcon={<ChevronRightIcon />}
                variant="outline"
              >
                Next
              </Button>
            </HStack>
          </VStack>
        </Hide>
      </VStack>
    </Box>
  );
}