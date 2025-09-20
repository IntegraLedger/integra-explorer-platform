import {
  Box,
  Input,
  InputGroup,
  InputLeftElement as InputLeftIcon,
  InputRightElement,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, type FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from './SearchResults';
import { SearchHistory } from './SearchHistory';
import { validators } from '@/utils/validators';
import type { SearchResult } from '@/types/api.types';

interface UniversalSearchProps {
  chainId?: number;
}

export function UniversalSearch({ chainId }: UniversalSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const { search, isSearching, searchResults, searchError, searchHistory, clearHistory } = useSearch();

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();

    if (!validators.isValidSearchQuery(query)) {
      return;
    }

    setShowHistory(false);
    setShowResults(true);

    search({ query: query.trim(), chainId });
  }, [query, chainId, search]);

  const handleClear = useCallback(() => {
    setQuery('');
    setShowResults(false);
    setShowHistory(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (!query && searchHistory.length > 0) {
      setShowHistory(true);
    }
  }, [query, searchHistory]);

  const handleBlur = useCallback(() => {
    // Delay to allow click events on results
    setTimeout(() => {
      setShowHistory(false);
      if (!searchResults || searchResults.length === 0) {
        setShowResults(false);
      }
    }, 200);
  }, [searchResults]);

  const handleHistorySelect = useCallback((historicQuery: string) => {
    setQuery(historicQuery);
    setShowHistory(false);
    setShowResults(true);
    search({ query: historicQuery, chainId });
  }, [chainId, search]);

  const handleResultSelect = useCallback((result: SearchResult) => {
    setShowResults(false);
    setQuery('');

    // Navigate based on result type
    if (result.type === 'transaction' && result.result && 'transactions' in result.result) {
      // For universal search results, navigate to the first transaction
      if (result.result.transactions.length > 0) {
        navigate(`/tx/${result.result.transactions[0].hash}`);
      }
    } else if (result.type === 'block' && result.result && 'blockNumber' in result.result) {
      navigate(`/block/${result.result.blockNumber}`);
    }
  }, [navigate]);

  return (
    <Box position="relative" w="full" mx="auto">
      <form onSubmit={handleSubmit}>
        <InputGroup size="lg">
          <InputLeftIcon pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftIcon>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search by transaction hash, Integra hash, or document hash..."
            bg="white"
            color="gray.800"
            borderColor="white"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            _placeholder={{ color: 'gray.500' }}
            _focus={{
              borderColor: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            _dark={{
              bg: 'gray.800',
              color: 'white',
              borderColor: 'gray.600',
              _focus: {
                borderColor: 'gray.500',
              },
            }}
          />
          <InputRightElement>
            {(() => {
              if (isSearching) {
                return <Spinner size="sm" color="blue.500" />;
              }
              if (query) {
                return (
                  <IconButton
                    aria-label="Clear search"
                    icon={<CloseIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={handleClear}
                  />
                );
              }
              return null;
            })()}
          </InputRightElement>
        </InputGroup>
      </form>

      {showHistory && searchHistory.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          zIndex={10}
        >
          <SearchHistory
            history={searchHistory}
            onSelect={handleHistorySelect}
            onClear={clearHistory}
          />
        </Box>
      )}

      {showResults && searchResults && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          zIndex={10}
        >
          <SearchResults
            results={searchResults}
            error={searchError}
            onSelect={handleResultSelect}
          />
        </Box>
      )}
    </Box>
  );
}