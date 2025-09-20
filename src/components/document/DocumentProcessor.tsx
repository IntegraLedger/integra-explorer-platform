import { useState, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  useColorModeValue,
  useToast,
  IconButton,
  Code,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { CopyIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import {
  FileDropZone,
  useDocumentProcessor,
} from '@integraledger/document-processor-react';
import { DocumentViewer } from '@integraledger/universal-document-viewer';
import { logger } from '@/services/logger.service';

interface ProcessedDocument {
  file: File;
  sha256: string;
}

export function DocumentProcessor() {
  const [document, setDocument] = useState<ProcessedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const dropzoneBg = useColorModeValue('gray.50', 'gray.900');
  const hashBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryText = useColorModeValue('gray.600', 'gray.400');
  const hoverBorderColor = useColorModeValue('blue.400', 'blue.300');
  const supportedFormatsBg = useColorModeValue('blue.50', 'blue.900');
  const supportedFormatsTitle = useColorModeValue('blue.700', 'blue.200');
  const supportedFormatsText = useColorModeValue('blue.600', 'blue.300');
  const supportedFormatsSize = useColorModeValue('blue.500', 'blue.400');

  const { processDocument } = useDocumentProcessor();

  const handleSearch = useCallback((hash: string) => {
    navigate(`/?search=${hash}`);
  }, [navigate]);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) {return;}

    const file = files[0];
    setIsProcessing(true);

    try {
      const result = await processDocument({
        file,
      });

      setDocument({
        file,
        sha256: result.documentHash.sha256,
      });

      logger.info('Document processed', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        sha256: result.documentHash.sha256,
        keccak256: result.documentHash.keccak256,
      });

      // Auto-search with the hash after a short delay (with 0x prefix)
      setTimeout(() => {
        handleSearch(`0x${result.documentHash.sha256}`);
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process document';
      logger.error('Document processing failed', error instanceof Error ? error : new Error(String(error)));
      toast({
        title: 'Processing failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processDocument, handleSearch, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'SHA256 hash copied',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  const resetDocument = () => {
    setDocument(null);
    setIsProcessing(false);
    // Clear the file input value to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    navigate('/');
  };

  const handleClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(Array.from(files));
      // Clear the input after processing to allow re-selecting the same file
      e.target.value = '';
    }
  };

  if (document && !isProcessing) {
    return (
      <Box maxW="600px" mx="auto">
        <Box
          bg={dropzoneBg}
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="lg"
          overflow="hidden"
        >
          {/* Header */}
          <Box p={4} borderBottom="1px" borderColor={borderColor} bg={bg}>
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold" color={textColor}>
                {document.file.name}
              </Text>
              <Text fontSize="sm" color={secondaryText}>
                {(document.file.size / 1024).toFixed(2)} KB
              </Text>
            </VStack>
          </Box>

          {/* Document Viewer - Same height as dropzone */}
          <Box
            p={10}
            sx={{
              // Hide navigation controls in the document viewer
              '& .document-viewer-controls': {
                display: 'none !important',
              },
              '& .pdf-navigation': {
                display: 'none !important',
              },
              '& .page-navigation': {
                display: 'none !important',
              },
              // Hide buttons that might be navigation
              '& button[aria-label*="Previous"], & button[aria-label*="Next"], & button[aria-label*="previous"], & button[aria-label*="next"]': {
                display: 'none !important',
              },
              // Hide page indicators
              '& .page-indicator, & .page-number, & .page-count': {
                display: 'none !important',
              },
              // Hide any divs that might contain navigation
              '& div[class*="navigation"], & div[class*="Navigation"], & div[class*="controls"], & div[class*="Controls"]': {
                display: 'none !important',
              },
              // Additional selectors for common PDF viewer controls
              '& .pdf-viewer-controls, & .pdf-controls, & .viewer-controls': {
                display: 'none !important',
              },
            }}
          >
            <VStack spacing={4}>
              <DocumentViewer
                file={document.file}
                onError={() => {
                  // Silently handle errors - the DocumentViewer sometimes throws errors
                  // even when the preview displays correctly, so we don't show a toast
                }}
                mode="full"
              />
            </VStack>
          </Box>

          {/* SHA256 Hash Section */}
          <Box p={4} borderTop="1px" borderColor={borderColor} bg={bg}>
            <VStack spacing={4} align="stretch">
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  SHA256 Hash
                </Text>
                <HStack
                  p={3}
                  bg={hashBg}
                  borderRadius="md"
                  justify="space-between"
                  align="center"
                >
                  <Code
                    fontSize="sm"
                    bg="transparent"
                    color="purple.500"
                    wordBreak="break-all"
                  >
                    0x{document.sha256}
                  </Code>
                  <IconButton
                    aria-label="Copy hash"
                    icon={<CopyIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`0x${document.sha256}`)}
                  />
                </HStack>
              </VStack>

              <Button
                colorScheme="blue"
                variant="solid"
                onClick={resetDocument}
                width="full"
              >
                Reset
              </Button>
            </VStack>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto">
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.md,.csv,.json,.xml,.doc,.docx,.xls,.xlsx"
        onChange={handleFileInputChange}
      />
      <FileDropZone
        onFilesSelected={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.md,.csv,.json,.xml,.doc,.docx,.xls,.xlsx"
        maxSize={25 * 1024 * 1024}
        multiple={false}
      >
        <Box
          p={10}
          bg={dropzoneBg}
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="lg"
          cursor={isProcessing ? 'not-allowed' : 'pointer'}
          transition="all 0.2s"
          onClick={handleClick}
          _hover={!isProcessing ? {
            borderColor: hoverBorderColor,
            transform: 'scale(1.02)',
          } : undefined}
        >
          <VStack spacing={4}>
            {isProcessing ? (
              <>
                <Spinner size="xl" color="blue.500" thickness="3px" />
                <Text fontSize="lg" fontWeight="medium" color={textColor}>
                  Processing document...
                </Text>
              </>
            ) : (
              <>
                <Icon
                  as={FiCheckCircle}
                  boxSize={12}
                  color="gray.400"
                />
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="medium" color={textColor} textAlign="center">
                    Drop a document here or click to select and authenticate
                  </Text>
                  <Text fontSize="sm" color={secondaryText} textAlign="center">
                    The document hash will be calculated in your browser. The document stays private to you and is not uploaded.
                  </Text>
                </VStack>
              </>
            )}

            <Box
              mt={4}
              p={3}
              bg={supportedFormatsBg}
              borderRadius="md"
              w="full"
            >
              <VStack spacing={2} align="start">
                <Text fontSize="xs" fontWeight="semibold" color={supportedFormatsTitle}>
                  Supported Formats:
                </Text>
                <Text fontSize="xs" color={supportedFormatsText}>
                  PDF, Images (PNG, JPG, JPEG, GIF, WebP), Documents (DOC, DOCX),
                  Excel (XLS, XLSX), Text files (TXT, MD, CSV), JSON, XML
                </Text>
                <Text fontSize="xs" color={supportedFormatsSize}>
                  Maximum file size: 25MB
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </FileDropZone>
    </Box>
  );
}