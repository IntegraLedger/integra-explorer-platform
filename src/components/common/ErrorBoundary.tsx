import { Component, type ReactNode } from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { logger } from '@/services/logger.service';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8}>
          <VStack spacing={4} align="center">
            <Heading size="lg">Something went wrong</Heading>
            <Text color="gray.600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button colorScheme="blue" onClick={this.handleReset}>
              Go to Home
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}