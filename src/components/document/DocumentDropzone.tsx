import {
  Box,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Progress,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile } from 'react-icons/fi';
import { useCallback } from 'react';
import { useFileHash } from '@/hooks/useFileHash';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/services/logger.service';
import { FileMetadata } from './FileMetadata';
import { HashCalculator } from './HashCalculator';

export function DocumentDropzone() {
  const navigate = useNavigate();
  const { calculateHash, isCalculating, fileMetadata, hash, error, reset } = useFileHash();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const hoverBorderColor = useColorModeValue('blue.400', 'blue.300');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {return;}

    const file = acceptedFiles[0];

    try {
      const fileHash = await calculateHash(file);
      logger.info('File hash calculated', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hash: fileHash,
      });
      // Auto-search after hash calculation
      setTimeout(() => {
        navigate(`/?search=${fileHash}`);
      }, 1500);
    } catch (err) {
      logger.error('Hash calculation failed', err instanceof Error ? err : new Error(String(err)), {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    }
  }, [calculateHash, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  if (hash) {
    return (
      <Box maxW="600px" mx="auto">
        <HashCalculator hash={hash} onReset={handleReset} />
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto">
      <Box
        {...getRootProps()}
        p={10}
        bg={bg}
        border="2px dashed"
        borderColor={isDragActive ? hoverBorderColor : borderColor}
        borderRadius="lg"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          borderColor: hoverBorderColor,
          transform: 'scale(1.02)',
        }}
      >
        <input {...getInputProps()} />

        <VStack spacing={4}>
          <Icon
            as={isDragActive ? FiFile : FiUploadCloud}
            boxSize={12}
            color={isDragActive ? 'blue.400' : 'gray.400'}
          />

          <VStack spacing={1}>
            <Text fontSize="lg" fontWeight="medium">
              {isDragActive ? 'Drop the file here' : 'Drop a file here or click to select'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Maximum file size: 50MB
            </Text>
          </VStack>

          {isCalculating && (
            <Box w="full">
              <Progress size="xs" isIndeterminate colorScheme="blue" />
              <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                Calculating hash...
              </Text>
            </Box>
          )}

          {error && (
            <Text fontSize="sm" color="red.500" textAlign="center">
              {error}
            </Text>
          )}
        </VStack>
      </Box>

      {fileMetadata && !hash && (
        <Box mt={4}>
          <FileMetadata metadata={fileMetadata} />
        </Box>
      )}

      <VStack mt={6} spacing={2} align="start">
        <Text fontSize="sm" color="gray.600">
          Supported file types:
        </Text>
        <Text fontSize="xs" color="gray.500">
          PDF, Images (PNG, JPG, JPEG, GIF), Text files (TXT, MD, CSV), JSON, XML
        </Text>
      </VStack>
    </Box>
  );
}