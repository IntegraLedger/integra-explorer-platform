import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { CloseIcon, TimeIcon } from '@chakra-ui/icons';
import { formatters } from '@/utils/formatters';
import type { SearchHistory } from '@/types/search.types';

interface SearchHistoryProps {
  history: SearchHistory[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="lg"
      maxH="300px"
      overflowY="auto"
    >
      <HStack justify="space-between" p={3} borderBottom="1px" borderColor={borderColor}>
        <Text fontSize="sm" fontWeight="medium" color="gray.500">
          Recent Searches
        </Text>
        <IconButton
          aria-label="Clear history"
          icon={<CloseIcon />}
          size="xs"
          variant="ghost"
          onClick={onClear}
        />
      </HStack>

      <VStack spacing={0} align="stretch">
        {history.map((item, index) => (
          <Box key={index}>
            <HStack
              p={3}
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              onClick={() => onSelect(item.query)}
              spacing={3}
            >
              <TimeIcon color="gray.400" />
              <VStack align="stretch" flex={1} spacing={0}>
                <Text fontSize="sm" fontFamily="mono" isTruncated>
                  {item.query}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {formatters.formatRelativeTime(item.timestamp)}
                </Text>
              </VStack>
            </HStack>
            {index < history.length - 1 && <Divider />}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}