import {
  Box,
  Container,
  VStack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { UniversalSearch } from "@/components/search/UniversalSearch";

interface HeroSectionProps {
  selectedChain: number;
}

export function HeroSection({ selectedChain }: HeroSectionProps) {
  const textColor = useColorModeValue("white", "whiteAlpha.900");

  return (
    <Box
      bg="#3B54B9"
      w="100vw"
      h={{ base: "150px", md: "192px" }} // Smaller on mobile
      position="relative"
      left="50%"
      right="50%"
      ml="-50vw"
      mr="-50vw"
    >
      <Container maxW="container.xl" h="full" px={{ base: 4, md: 8 }}>
        <VStack
          h="full"
          justify="center"
          spacing={{ base: 4, md: 6 }}
          align="center"
        >
          <Heading
            size={{ base: "md", md: "xl" }}
            color={textColor}
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            Explore public blockchains for Integra document registrations $
          </Heading>

          <Box w="full" maxW="720px" px={{ base: 2, md: 0 }}>
            <UniversalSearch
              chainId={selectedChain === 0 ? undefined : selectedChain}
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
