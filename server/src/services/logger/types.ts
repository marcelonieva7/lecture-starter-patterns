import { type LogLevel as LogLevelType } from "../../common/types/types";

interface Observer {
  update(logLevel: LogLevelType, message: string): void;
}

interface Logger {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notify(logLevel: LogLevelType, message: string): void;
}

export { type Observer, type Logger };
