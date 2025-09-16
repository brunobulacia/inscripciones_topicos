import { LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class FileLogger implements LoggerService {
  private logFilePath: string;

  constructor(filename = 'app.log') {
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    this.logFilePath = path.join(logsDir, filename);
  }

  private writeToFile(level: string, message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` [${context}]` : '';
    const text = `${timestamp} ${level}${ctx} ${typeof message === 'string' ? message : JSON.stringify(message)}\n`;
    // Append asynchronously
    fs.appendFile(this.logFilePath, text, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to write log to file:', err);
      }
    });
  }

  log(message: any, context?: string) {
    // keep console behaviour
    // eslint-disable-next-line no-console
    console.log(message, context ? ` [${context}]` : '');
    this.writeToFile('LOG', message, context);
  }
  error(message: any, trace?: string, context?: string) {
    // eslint-disable-next-line no-console
    console.error(message, trace ?? '', context ? ` [${context}]` : '');
    const msg = trace ? `${message} ${trace}` : message;
    this.writeToFile('ERROR', msg, context);
  }
  warn(message: any, context?: string) {
    // eslint-disable-next-line no-console
    console.warn(message, context ? ` [${context}]` : '');
    this.writeToFile('WARN', message, context);
  }
  debug?(message: any, context?: string) {
    // eslint-disable-next-line no-console
    console.debug
      ? console.debug(message, context ?? '')
      : console.log(message, context ?? '');
    this.writeToFile('DEBUG', message, context);
  }
  verbose?(message: any, context?: string) {
    // eslint-disable-next-line no-console
    console.log(message, context ? ` [${context}]` : '');
    this.writeToFile('VERBOSE', message, context);
  }
  setLogLevels?(levels: LogLevel[]) {
    // no-op for this simple logger
  }
}
