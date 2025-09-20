import { Box } from '@chakra-ui/react';
import { TransactionDetail } from '@/components/transactions/TransactionDetail';

export function Transaction() {
  return (
    <Box w="full">
      <TransactionDetail />
    </Box>
  );
}