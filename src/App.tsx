import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Layout } from '@/components/common/Layout';
import { Home } from '@/pages/Home';
import { Transaction } from '@/pages/Transaction';
import { Block } from '@/pages/Block';
import { Calculator } from '@/pages/Calculator';
import { QR } from '@/pages/QR';
import { trpc, trpcClient } from '@/utils/trpc';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      retry: 2,
      refetchOnWindowFocus: false,
      networkMode: 'always', // Required for Chrome compatibility
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

function App() {
  const [selectedChain, setSelectedChain] = useState(0); // 0 = All chains

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ChakraProvider>
          <ColorModeScript />
          <ErrorBoundary>
            <Router>
              <Layout selectedChain={selectedChain} onChainSelect={setSelectedChain}>
                <Routes>
                  <Route path="/" element={<Home selectedChain={selectedChain} />} />
                  <Route path="/qr/:hash" element={<QR />} />
                  <Route path="/tx/:hash" element={<Transaction />} />
                  <Route path="/block/:blockNumber" element={<Block />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/transactions" element={<Home selectedChain={selectedChain} />} />
                </Routes>
              </Layout>
            </Router>
          </ErrorBoundary>
        </ChakraProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default App;