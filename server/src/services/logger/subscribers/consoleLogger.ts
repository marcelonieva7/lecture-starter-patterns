import { LogLevel } from "../../../common/enums/enums";
import { type Observer } from "../types";
import { type LogLevel as LogLevelType } from "../../../common/types/types";

class ConsoleLogger implements Observer {
  update(logLevel: LogLevelType, message: string): void {
    if (logLevel === LogLevel.ERROR) {
      console.error(`[${logLevel.toUpperCase()}] ${message}`);
    }
  }
}

export { ConsoleLogger };
