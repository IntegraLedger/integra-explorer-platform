import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  useColorModeValue,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import type { TransactionSummaryDto } from '@/types/transaction.types';
import { formatters } from '@/utils/formatters';

interface TransactionCardProps {
  transaction: TransactionSummaryDto;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <RouterLink to={`/tx/${transaction.hash}`}>
      <Box
        p={4}
        bg={bg}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        _hover={{ bg: hoverBg, transform: 'translateY(-2px)' }}
        transition="all 0.2s"
        cursor="pointer"
      >
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <HStack>
              <Icon
                as={transaction.status === 'success' ? CheckCircleIcon : CloseIcon}
                color={transaction.status === 'success' ? 'green.500' : 'red.500'}
              />
              <Tooltip label={transaction.hash}>
                <Text fontFamily="mono" fontSize="sm">
                  {formatters.truncateHash(transaction.hash)}
                </Text>
              </Tooltip>
            </HStack>
            <Badge colorScheme={formatters.getStatusColor(transaction.status)}>
              {transaction.status}
            </Badge>
          </HStack>

          <HStack justify="space-between" fontSize="sm">
            <Text color="gray.500">From</Text>
            <Tooltip label={transaction.from}>
              <Text fontFamily="mono">
                {formatters.truncateAddress(transaction.from)}
              </Text>
            </Tooltip>
          </HStack>

          <HStack justify="space-between" fontSize="sm">
            <Text color="gray.500">To</Text>
            <Tooltip label={transaction.to}>
              <Text fontFamily="mono">
                {formatters.truncateAddress(transaction.to)}
              </Text>
            </Tooltip>
          </HStack>

          <HStack justify="space-between" fontSize="sm">
            <HStack spacing={4}>
              <Text color="gray.500">Block</Text>
              <Text fontWeight="medium">#{formatters.formatNumber(transaction.blockNumber)}</Text>
            </HStack>
            <Text color="gray.500" fontSize="xs">
              {formatters.formatRelativeTime(transaction.timestamp)}
            </Text>
          </HStack>

          {transaction.contractType && (
            <HStack>
              <Badge colorScheme="purple" size="sm">
                {transaction.contractType}
              </Badge>
              {transaction.method && (
                <Badge colorScheme="blue" size="sm">
                  {transaction.method}
                </Badge>
              )}
            </HStack>
          )}
        </VStack>
      </Box>
    </RouterLink>
  );
}