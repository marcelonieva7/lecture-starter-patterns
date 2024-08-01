import { type LogLevel } from "../../common/types/types";
import { type Observer, type Logger } from "./types";

// PATTERN:{name of Observer}
class LogPublisher implements Logger {
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex > -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  notify(logLevel: LogLevel, message: string): void {
    this.observers.forEach((observer) => observer.update(logLevel, message));
  }
}

export { LogPublisher };
