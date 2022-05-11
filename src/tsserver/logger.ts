import { TSLogger } from "./types";

export class Logger {
  private static tsLogger: TSLogger;

  static setup(tsLogger: TSLogger) {
    Logger.tsLogger = tsLogger;
  }

  static info(message?: unknown, scope?: string) {
    const prefix = scope ? `Logger [${scope}]: ` : "Logger: ";
    if (typeof message === "string" || typeof message === "number") {
      Logger.tsLogger.info(`${prefix} ${message}`);
    } else if (typeof message === "boolean") {
      Logger.tsLogger.info(`${prefix} ${String(message)}`);
    } else if (typeof message === "object") {
      Logger.tsLogger.info(`${prefix} ${JSON.stringify(message)}`);
    } else {
      Logger.tsLogger.info(`${prefix} ${message}`);
    }
  }
}
