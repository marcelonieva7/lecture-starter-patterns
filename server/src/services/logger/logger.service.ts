import { LogPublisher } from "./loggerPublisher";
import { FileLogger } from "./subscribers/fileLogger";
import { ConsoleLogger } from "./subscribers/consoleLogger";

const LOGS_FILE = "DB_logs.log";

const loggerService = new LogPublisher();
const fileLogger = new FileLogger(LOGS_FILE);
const consoleLogger = new ConsoleLogger();

loggerService.addObserver(fileLogger);
loggerService.addObserver(consoleLogger);

export { loggerService };
