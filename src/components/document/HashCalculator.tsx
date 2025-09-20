import {
  Box,
  VStack,
  HStack,
  Text,
  Code,
  Button,
  useColorModeValue,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface HashCalculatorProps {
  hash: string;
  onReset: () => void;
}

export function HashCalculator({ hash, onReset }: HashCalculatorProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navigate = useNavigate();
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    toast({
      title: 'Hash copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSearch = () => {
    navigate(`/?search=${hash}`);
  };

  return (
    <Box
      p={6}
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
    >
      <VStack spacing={4}>
        <Icon as={CheckCircleIcon} boxSize={12} color="green.500" />

        <Text fontSize="lg" fontWeight="medium">
          Hash Calculated Successfully
        </Text>

        <Box w="full">
          <Text fontSize="sm" color="gray.500" mb={2}>
            Keccak256 Hash:
          </Text>
          <Code
            p={3}
            borderRadius="md"
            fontSize="sm"
            wordBreak="break-all"
            display="block"
            colorScheme="blue"
          >
            {hash}
          </Code>
        </Box>

        <HStack spacing={3} w="full">
          <Button
            leftIcon={<CopyIcon />}
            onClick={handleCopy}
            size="sm"
            variant="outline"
            flex={1}
          >
            Copy Hash
          </Button>
          <Button
            leftIcon={<FiSearch />}
            onClick={handleSearch}
            colorScheme="blue"
            size="sm"
            flex={1}
          >
            Search Hash
          </Button>
        </HStack>

        <Button onClick={onReset} variant="ghost" size="sm" w="full">
          Calculate Another Hash
        </Button>
      </VStack>
    </Box>
  );
}