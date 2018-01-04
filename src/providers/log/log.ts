import { Injectable } from '@angular/core';
import { LoggingService, Logger, LogMessage } from 'ionic-logging-service';

/**
 * Service to get logs of the app behaviour, for support purposes (Sentry)
 *
 * @export
 * @class Log
 */
@Injectable()
export class Log {
  data: any = null;

  public logs: { [key: string]: Logger }[] = [];

  constructor(public loggingService: LoggingService) {}

  /**
   * Create logger for a component/provider of the application
   */
  setLogger(className: string) {
    this.logs[className] = this.loggingService.getLogger(className);
  }
  /**
   * Return all log messages stored
   */
  getLogMessages(): LogMessage[] {
    return this.loggingService.getLogMessages();
  }
}
