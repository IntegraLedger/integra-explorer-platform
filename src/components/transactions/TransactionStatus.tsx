import { Badge } from '@chakra-ui/react';

interface TransactionStatusProps {
  status: 'success' | 'failed';
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  return (
    <Badge
      colorScheme={status === 'success' ? 'green' : 'red'}
      fontSize="xs"
      px={2}
      py={1}
      borderRadius="full"
    >
      {status}
    </Badge>
  );
}