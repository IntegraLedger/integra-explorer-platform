/**
 * StandardLogger - Structured logging for all services
 * DO NOT MODIFY - This follows DISTRIBUTED-SYSTEM-RULES.md
 */

export interface LoggerConfig {
  service: string;
  environment: string;
  level: 'debug' | 'info' | 'warn' | 'error';
}

export interface LogContext {
  correlationId?: string;
  [key: string]: unknown;
}

export class StandardLogger {
  private readonly service: string;
  private readonly environment: string;
  private readonly level: string;
  private readonly levelPriority: Record<string, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(configOrServiceName: LoggerConfig | string) {
    // Migration compatibility: accept string service name
    if (typeof configOrServiceName === 'string') {
      this.service = configOrServiceName;
      this.environment = (process.env.ENVIRONMENT as LoggerConfig['environment']) || 'development';
      this.level = (process.env.LOG_LEVEL as LoggerConfig['level']) || 'info';
    } else {
      this.service = configOrServiceName.service;
      this.environment = configOrServiceName.environment;
      this.level = configOrServiceName.level;
    }
  }

  private shouldLog(level: string): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.level];
  }

  private formatLog(level: string, eventType: string, message: string, context?: LogContext): string {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      environment: this.environment,
      eventType,
      message,
      ...context,
    };
    return JSON.stringify(log);
  }

  debug(eventTypeOrMessage: string, errorOrContext?: Error | LogContext, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      const [eventType, ctx] = this.normalizeArgs(eventTypeOrMessage, errorOrContext, context);
      console.warn(this.formatLog('debug', eventType, eventType, ctx));
    }
  }

  info(eventTypeOrMessage: string, errorOrContext?: Error | LogContext, context?: LogContext): void {
    if (this.shouldLog('info')) {
      const [eventType, ctx] = this.normalizeArgs(eventTypeOrMessage, errorOrContext, context);
      console.warn(this.formatLog('info', eventType, eventType, ctx));
    }
  }

  warn(eventTypeOrMessage: string, errorOrContext?: Error | LogContext, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      const [eventType, ctx] = this.normalizeArgs(eventTypeOrMessage, errorOrContext, context);
      console.warn(this.formatLog('warn', eventType, eventType, ctx));
    }
  }

  error(eventTypeOrMessage: string, errorOrContext?: Error | LogContext, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const [eventType, ctx] = this.normalizeArgs(eventTypeOrMessage, errorOrContext, context);
      console.error(this.formatLog('error', eventType, eventType, ctx));
    }
  }

  private normalizeArgs(
    eventTypeOrMessage: string,
    errorOrContext?: Error | LogContext,
    context?: LogContext,
  ): [string, LogContext | undefined] {
    // Migration compatibility: handle (message, error, context) signature
    if (errorOrContext instanceof Error) {
      return [eventTypeOrMessage, { ...context, error: errorOrContext.message, stack: errorOrContext.stack }];
    }
    // New signature: (eventType, context)
    return [eventTypeOrMessage, errorOrContext as LogContext | undefined];
  }

  child(context: LogContext): StandardLogger {
    const childLogger = new StandardLogger({
      service: this.service,
      environment: this.environment,
      level: this.level as LoggerConfig['level'],
    });

    // Create a wrapper that adds context to all log calls
    return new Proxy(childLogger, {
      get(target, prop) {
        if (typeof target[prop as keyof StandardLogger] === 'function' && ['debug', 'info', 'warn', 'error'].includes(prop as string)) {
          return (eventType: string, additionalContext?: LogContext) => {
            (target[prop as keyof StandardLogger] as (eventType: string, context?: LogContext) => void)(eventType, { ...context, ...additionalContext });
          };
        }
        return target[prop as keyof StandardLogger];
      },
    }) as StandardLogger;
  }
}