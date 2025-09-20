import { FrontendLogger } from '@integraledger/frontend-logger';

// Create the frontend logger instance with EFK support
const frontendLogger = new FrontendLogger({
  service: 'integra-explorer',
  environment: import.meta.env.MODE || 'development',
  endpoint: '/api/logs',
  enableConsole: import.meta.env.DEV,
  enableRemote: false, // Disable for Cloudflare
  minimumLevel: import.meta.env.DEV ? 'debug' : 'info',
  beforeSend: (log) => {
    // Filter out sensitive data
    if (log.context?.metadata?.privateKey) {
      delete log.context.metadata.privateKey;
    }
    if (log.context?.metadata?.apiKey) {
      log.context.metadata.apiKey = '[REDACTED]';
    }

    // Don't send debug logs in production
    if (log.level === 'debug' && import.meta.env.PROD) {
      return null;
    }

    return log;
  },
});

// Export a backward-compatible interface while using the new logger
export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    frontendLogger.debug(message, 'app.debug', {
      metadata: args.length > 0 ? { args } : undefined,
    });
  },
  info: (message: string, ...args: unknown[]) => {
    frontendLogger.info(message, 'app.info', {
      metadata: args.length > 0 ? { args } : undefined,
    });
  },
  warn: (message: string, ...args: unknown[]) => {
    frontendLogger.warn(message, 'app.warning', {
      metadata: args.length > 0 ? { args } : undefined,
    });
  },
  error: (message: string, error?: unknown, context?: unknown) => {
    frontendLogger.error(
      message,
      'app.error',
      {
        metadata: context as Record<string, unknown> | undefined,
      },
      error instanceof Error ? error : undefined,
    );
  },
  fatal: (message: string, error?: unknown, context?: unknown) => {
    frontendLogger.fatal(
      message,
      'app.fatal',
      {
        metadata: context as Record<string, unknown> | undefined,
      },
      error instanceof Error ? error : undefined,
    );
  },
};

// Export the raw frontend logger for advanced usage
export { frontendLogger };