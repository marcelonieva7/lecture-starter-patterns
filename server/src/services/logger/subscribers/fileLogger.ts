import { appendFileSync, existsSync, mkdirSync } from "fs";
import * as path from "path";
import { type Observer } from "../types";
import { type LogLevel } from "../../../common/types/types";

class FileLogger implements Observer {
  private filePath: string;
  private logsPath = path.join(process.cwd(), "logs");

  constructor(fileName: string) {
    this.checkLogsDirectoryExists();
    this.filePath = `${this.logsPath}/${fileName}`;
  }

  update(logLevel: LogLevel, message: string): void {
    const logMessage = `[${logLevel.toUpperCase()}] ${message}\n`;
    appendFileSync(this.filePath, logMessage);
  }

  private checkLogsDirectoryExists(): void {
    if (!existsSync(this.logsPath)) {
      mkdirSync(this.logsPath, { recursive: true });
    }
  }
}

export { FileLogger };
