/**
 * Structured logging utility
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  requestId?: string
}

class Logger {
  private level: LogLevel

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (level > this.level) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    // In production, you might want to send logs to a service like DataDog, Sentry, etc.
    if (process.env.NODE_ENV === "production") {
      this.sendToLoggingService(entry)
    } else {
      this.consoleLog(entry)
    }
  }

  private consoleLog(entry: LogEntry) {
    const levelNames = ["ERROR", "WARN", "INFO", "DEBUG"]
    const levelName = levelNames[entry.level]

    const logMessage = `[${entry.timestamp}] ${levelName}: ${entry.message}`

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(logMessage, entry.context, entry.error)
        break
      case LogLevel.WARN:
        console.warn(logMessage, entry.context)
        break
      case LogLevel.INFO:
        console.info(logMessage, entry.context)
        break
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.context)
        break
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    // Implement integration with logging service
    // Example: Sentry, DataDog, CloudWatch, etc.
    try {
      // await loggingService.send(entry)
    } catch (error) {
      console.error("Failed to send log to service:", error)
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  // Create child logger with additional context
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.level)
    const originalLog = childLogger.log.bind(childLogger)

    childLogger.log = (level: LogLevel, message: string, additionalContext?: Record<string, any>, error?: Error) => {
      const mergedContext = { ...context, ...additionalContext }
      originalLog(level, message, mergedContext, error)
    }

    return childLogger
  }
}

// Global logger instance
export const logger = new Logger(process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG)

// Request logger middleware
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({ requestId, userId })
}
