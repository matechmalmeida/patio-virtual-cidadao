type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
  timestamp: string;
}

type LogTransport = (entry: LogEntry) => void;

const transports: LogTransport[] = [];

export function addLogTransport(transport: LogTransport) {
  transports.push(transport);
}

function dispatch(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    context,
    error,
    timestamp: new Date().toISOString(),
  };

  const consoleFn = level === 'debug' ? console.debug : level === 'info' ? console.info : level === 'warn' ? console.warn : console.error;

  if (error) {
    consoleFn(`[${level.toUpperCase()}] ${message}`, context ?? '', error);
  } else {
    consoleFn(`[${level.toUpperCase()}] ${message}`, context ?? '');
  }

  for (const transport of transports) {
    try {
      transport(entry);
    } catch {
      // noop
    }
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => dispatch('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => dispatch('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => dispatch('warn', message, context),
  error: (message: string, context?: Record<string, unknown>, error?: unknown) => dispatch('error', message, context, error),
};
