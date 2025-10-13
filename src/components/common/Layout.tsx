import { Box, Flex, Grid, GridItem, Container, Show } from '@chakra-ui/react';
import { DocumentProcessor } from '@/components/document/DocumentProcessor';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  selectedChain: number;
  onChainSelect: (chainId: number) => void;
}

export function Layout({ children, selectedChain, onChainSelect }: LayoutProps) {
  return (
    <Flex direction="column" minH="100vh">
      <Header selectedChain={selectedChain} onChainSelect={onChainSelect} />
      <HeroSection selectedChain={selectedChain} />
      <Container maxW="80%" px={{ base: 4, md: 8 }} py={0} flex="1">
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 3fr' }}
          gap={{ base: 0, md: 8 }}
          alignItems="flex-start"
          flex="1"
          py={{ base: 4, md: 8 }}
        >
          {/* Document Processor - Hidden on mobile */}
          <Show above="md">
            <GridItem colSpan={1} w="100%">
              <Box w="full">
                <DocumentProcessor />
              </Box>
            </GridItem>
          </Show>

          {/* Main Content - Full width on mobile */}
          <GridItem colSpan={{ base: 1, md: 1 }} w="100%">
            <Box w="full">
              {children}
            </Box>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </Flex>
  );
}