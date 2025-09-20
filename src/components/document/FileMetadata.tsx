import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import type { FileMetadata as FileMetadataType } from '@/types/search.types';
import { HashService } from '@/services/hash.service';
import { formatters } from '@/utils/formatters';

interface FileMetadataProps {
  metadata: FileMetadataType;
}

export function FileMetadata({ metadata }: FileMetadataProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      p={4}
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.500">File Name</Text>
          <Text fontSize="sm" fontWeight="medium" isTruncated maxW="300px">
            {metadata.name}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.500">Size</Text>
          <Text fontSize="sm">
            {HashService.formatFileSize(metadata.size)}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.500">Type</Text>
          <Badge colorScheme="blue" size="sm">
            {metadata.type || 'Unknown'}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.500">Last Modified</Text>
          <Text fontSize="sm">
            {formatters.formatDate(metadata.lastModified)}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}