import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useColorModeValue,
  Code,
  Heading,
  IconButton,
  Collapse,
  Button,
  Tooltip,
  useToast,
  Image,
} from '@chakra-ui/react';
import { CopyIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import { useTransactionDetail } from '@/hooks/useTransactions';
import { formatters } from '@/utils/formatters';
import { getChainConfig, getChainExplorerUrl } from '@/utils/chains';
import { useState } from 'react';

export function TransactionDetail() {
  const { hash } = useParams<{ hash: string }>();
  const { data: transaction, isLoading, error } = useTransactionDetail(hash || '');
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [showDecodedData, setShowDecodedData] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const secondaryText = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const sectionHeadingColor = useColorModeValue('gray.700', 'gray.200');
  const detailCardBg = useColorModeValue('gray.50', 'gray.900');
  const detailCardBorder = useColorModeValue('gray.200', 'gray.700');
  const detailCardLabel = useColorModeValue('gray.600', 'gray.400');
  const detailCardValue = useColorModeValue('gray.800', 'gray.200');
  const codeBlockBg = useColorModeValue('gray.100', 'gray.800');

  const copyToClipboard = (text: string, label: string = 'Value') => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  if (isLoading) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="3px" />
          <Text color={secondaryText}>Loading transaction details...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !transaction) {
    return (
      <Alert
        status="error"
        borderRadius="lg"
        border="1px solid"
        borderColor="red.200"
      >
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">Transaction Not Found</Text>
          <Text fontSize="sm" color={secondaryText}>
            {error?.message || 'The requested transaction could not be found'}
          </Text>
        </VStack>
      </Alert>
    );
  }

  // Helper function to format field labels
  const formatFieldLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      integraHash: 'Integra Hash',
      documentHash: 'Document Hash',
      referenceHash: 'Reference Hash',
      processHash: 'Process Hash',
      encryptedData: 'Encrypted Data',
      zkProof: 'Zero-Knowledge Proof',
      contractType: 'Contract Type',
      method: 'Method Called',
    };
    return labelMap[key] || key.replace(/([A-Z])/g, ' $1').trim();
  };

  // Extract document-specific fields
  const documentFields = [
    { key: 'integraHash', value: transaction.integraHash, color: '#3B54B9' },
    { key: 'documentHash', value: transaction.documentHash, color: 'blue.500' },
    { key: 'processHash', value: transaction.processHash, color: 'orange.500' },
  ].filter(field => field.value);

  return (
    <VStack spacing={6} align="stretch">
      {/* Transaction Hash Box - Hero Section */}
      <Box
        bg={bg}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow="lg"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative gradient background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="4px"
          bgGradient={`linear(to-r, purple.400, ${accentColor}, blue.400)`}
        />

        <VStack align="stretch" spacing={4}>
          <VStack align={{ base: 'start', md: 'center' }} spacing={3} w="full">
            <VStack align={{ base: 'start', md: 'center' }} spacing={2} w="full">
              <Heading size={{ base: 'md', md: 'lg' }} color={headingColor} textAlign={{ base: 'left', md: 'center' }}>
                Document Registration Proof
              </Heading>
              <HStack spacing={3} align="center">
                {(() => {
                  const chainConfig = getChainConfig(transaction.chainId);
                  if (chainConfig) {
                    return (
                      <>
                        <Image
                          src={chainConfig.icon}
                          alt={chainConfig.name}
                          height="20px"
                          width="20px"
                        />
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color={headingColor}>
                          {chainConfig.name}
                        </Text>
                      </>
                    );
                  }
                  return (
                    <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color={headingColor}>
                      {formatters.getChainName(transaction.chainId)}
                    </Text>
                  );
                })()}
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={secondaryText}>
                  •
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={secondaryText}>
                  {formatters.formatDate(transaction.timestamp)}
                </Text>
                <Tooltip label="View on blockchain explorer" placement="top">
                  <IconButton
                    aria-label="View external"
                    icon={<ExternalLinkIcon />}
                    size="sm"
                    variant="ghost"
                    as="a"
                    href={getChainExplorerUrl(transaction.chainId, transaction.hash)}
                    target="_blank"
                    _hover={{ bg: hoverBg }}
                  />
                </Tooltip>
              </HStack>
            </VStack>

            <HStack spacing={2} w="full" align="center" justify="center">
              <Code
                fontSize={{ base: 'xs', md: 'md' }}
                fontFamily="mono"
                p={2}
                borderRadius="md"
                bg={cardBg}
                color={accentColor}
                wordBreak="break-all"
                flex="1"
                textAlign="center"
              >
                {transaction.hash}
              </Code>
              <Tooltip label="Copy transaction hash" placement="top">
                <IconButton
                  aria-label="Copy hash"
                  icon={<CopyIcon />}
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(transaction.hash, 'Transaction hash')}
                  _hover={{ bg: hoverBg }}
                />
              </Tooltip>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Document-Specific Fields */}
      {documentFields.length > 0 && (
        <Box
          bg={bg}
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <VStack align="stretch" spacing={4}>
            <Heading size={{ base: 'sm', md: 'md' }} color={sectionHeadingColor}>
              Document Identity and Proof
            </Heading>

            <VStack align="stretch" spacing={3}>
              {documentFields.map(({ key, value, color }) => (
                <Box
                  key={key}
                  p={{ base: 3, md: 4 }}
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{
                    borderColor: color,
                    transform: { base: 'none', md: 'translateX(4px)' },
                    boxShadow: 'md',
                  }}
                >
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between" align="start">
                      <Text fontSize="xs" fontWeight="semibold" color={secondaryText} textTransform="uppercase">
                        {formatFieldLabel(key)}
                      </Text>
                      <IconButton
                        aria-label={`Copy ${formatFieldLabel(key)}`}
                        icon={<CopyIcon />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(value || '', formatFieldLabel(key))}
                      />
                    </HStack>
                    <Text
                      fontSize={{ base: 'xs', md: 'sm' }}
                      fontFamily="mono"
                      color={color}
                      wordBreak="break-all"
                      noOfLines={{ base: 3, md: undefined }}
                    >
                      {value}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>
      )}

      {/* Collapsible Decoded Smart Contract Data */}
      {(transaction.decodedInput || (transaction.events && transaction.events.length > 0)) && (
        <Box
          bg={bg}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="md"
          overflow="hidden"
        >
          <Button
            onClick={() => setShowDecodedData(!showDecodedData)}
            variant="ghost"
            w="full"
            p={6}
            justifyContent="space-between"
            rightIcon={showDecodedData ? <ChevronUpIcon /> : <ChevronDownIcon />}
            _hover={{ bg: hoverBg }}
          >
            <HStack spacing={3}>
              <Heading size="sm" color={sectionHeadingColor}>
                Decoded Smart Contract Data
              </Heading>
              <Badge colorScheme="gray" fontSize="xs">
                Technical
              </Badge>
              {transaction.events && transaction.events.length > 0 && (
                <Badge colorScheme="green" fontSize="xs">
                  {transaction.events.length} Event{transaction.events.length > 1 ? 's' : ''}
                </Badge>
              )}
            </HStack>
          </Button>

          <Collapse in={showDecodedData}>
            <Box p={6} pt={0}>
              <VStack align="stretch" spacing={6}>
                {transaction.decodedInput && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={3} color={secondaryText}>
                      Input Parameters
                    </Text>
                    <Code
                      p={4}
                      borderRadius="lg"
                      fontSize="sm"
                      whiteSpace="pre-wrap"
                      overflowX="auto"
                      bg={cardBg}
                      display="block"
                    >
                      {JSON.stringify(transaction.decodedInput, null, 2)}
                    </Code>
                  </Box>
                )}

                {transaction.events && transaction.events.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={3} color={secondaryText}>
                      Event Logs
                    </Text>
                    <VStack align="stretch" spacing={3}>
                      {transaction.events.map((log: any, index: number) => (
                        <Box
                          key={index}
                          p={4}
                          bg={cardBg}
                          borderRadius="lg"
                          border="1px"
                          borderColor={borderColor}
                        >
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between">
                              {log.eventName && (
                                <Badge colorScheme="green" fontSize="sm">
                                  {log.eventName}
                                </Badge>
                              )}
                              <Text fontSize="xs" color={secondaryText}>
                                Log Index: {log.logIndex}
                              </Text>
                            </HStack>

                            <HStack spacing={2}>
                              <Text fontSize="xs" color={secondaryText}>Address:</Text>
                              <Text fontSize="xs" fontFamily="mono" color={accentColor}>
                                {log.address}
                              </Text>
                            </HStack>

                            {log.decodedData && (
                              <Code
                                p={3}
                                borderRadius="md"
                                fontSize="xs"
                                whiteSpace="pre-wrap"
                                overflowX="auto"
                                bg={codeBlockBg}
                                display="block"
                              >
                                {JSON.stringify(log.decodedData, null, 2)}
                              </Code>
                            )}
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Collapsible Blockchain Transaction Details */}
      <Box
        bg={bg}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow="md"
        overflow="hidden"
      >
        <Button
          onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
          variant="ghost"
          w="full"
          p={6}
          justifyContent="space-between"
          rightIcon={showBlockchainDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
          _hover={{ bg: hoverBg }}
        >
          <HStack spacing={3}>
            <Heading size="sm" color={sectionHeadingColor}>
              Blockchain Transaction Details
            </Heading>
            <Badge colorScheme="gray" fontSize="xs">
              Technical
            </Badge>
          </HStack>
        </Button>

        <Collapse in={showBlockchainDetails}>
          <Box p={6} pt={0}>
            <VStack align="stretch" spacing={3}>
              {/* Contract Method */}
              {transaction.method && (
                <HStack spacing={3} mb={2}>
                  <Text fontSize="sm" color={secondaryText}>Contract Method:</Text>
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                    {transaction.method}
                  </Badge>
                </HStack>
              )}
              <DetailCard
                label="From Address"
                value={transaction.from}
                copyable
                onCopy={() => copyToClipboard(transaction.from, 'From address')}
                isMonospace
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              <DetailCard
                label="To Address"
                value={transaction.to}
                copyable
                onCopy={() => copyToClipboard(transaction.to, 'To address')}
                isMonospace
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              {/* Hidden fields - commented out but preserved
              <DetailCard
                label="Value"
                value={`${formatters.formatEther(transaction.value)} MATIC`}
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              <DetailCard
                label="Transaction Fee"
                value={`${formatters.formatTxFee(transaction.gasUsed, transaction.gasPrice)} MATIC`}
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              <DetailCard
                label="Gas Price"
                value={`${formatters.formatGwei(transaction.gasPrice)} Gwei`}
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              */}
              <DetailCard
                label="Gas Used"
                value={formatters.formatNumber(transaction.gasUsed)}
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              <DetailCard
                label="Block Number"
                value={formatters.formatNumber(transaction.blockNumber)}
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              {/* Hidden field - commented out but preserved
              <DetailCard
                label="Nonce"
                value={transaction.nonce?.toString() || 'N/A'}
                bg={detailCardBg}
                borderColor={detailCardBorder}
                labelColor={detailCardLabel}
                valueColor={detailCardValue}
              />
              */}
              <Box
                p={4}
                bg={detailCardBg}
                borderRadius="lg"
                border="1px"
                borderColor={detailCardBorder}
              >
                <VStack align="start" spacing={1}>
                  <Text fontSize="xs" color={detailCardLabel} fontWeight="semibold" textTransform="uppercase">
                    Chain
                  </Text>
                  {(() => {
                    const chainConfig = getChainConfig(transaction.chainId);
                    if (chainConfig) {
                      return (
                        <HStack spacing={2}>
                          <Image
                            src={chainConfig.icon}
                            alt={chainConfig.name}
                            height="20px"
                            width="20px"
                          />
                          <Text
                            fontSize="sm"
                            color={detailCardValue}
                            fontWeight="medium"
                          >
                            {chainConfig.name}
                          </Text>
                        </HStack>
                      );
                    }
                    return (
                      <Text
                        fontSize="sm"
                        color={detailCardValue}
                        fontWeight="medium"
                      >
                        {formatters.getChainName(transaction.chainId)}
                      </Text>
                    );
                  })()}
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Collapse>
      </Box>
    </VStack>
  );
}

interface DetailCardProps {
  label: string;
  value: string | undefined;
  copyable?: boolean;
  onCopy?: () => void;
  isMonospace?: boolean;
  bg: string;
  borderColor: string;
  labelColor: string;
  valueColor: string;
}

function DetailCard({ label, value, copyable, onCopy, isMonospace, bg, borderColor, labelColor, valueColor }: DetailCardProps) {
  return (
    <Box
      p={4}
      bg={bg}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
    >
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="xs" color={labelColor} fontWeight="semibold" textTransform="uppercase">
            {label}
          </Text>
          <Text
            fontSize="sm"
            fontFamily={isMonospace ? 'mono' : 'body'}
            color={valueColor}
            wordBreak={isMonospace ? 'break-all' : 'normal'}
          >
            {value || 'N/A'}
          </Text>
        </VStack>
        {copyable && value && onCopy && (
          <IconButton
            aria-label={`Copy ${label}`}
            icon={<CopyIcon />}
            size="sm"
            variant="ghost"
            onClick={onCopy}
          />
        )}
      </HStack>
    </Box>
  );
}