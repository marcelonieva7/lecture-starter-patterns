import { type List } from "../../data/models/list";
import { type Reorder } from "./types";
import { LogLevel } from "../../common/enums/log-level.enum";
import { LogPublisher } from "../logger/loggerPublisher";
import { FileLogger } from "../logger/subscribers/fileLogger";
import { ReorderService } from "./reorder.service";
import { ConsoleLogger } from "../logger/subscribers/consoleLogger";

// PATTERN: Proxy
class ReorderServiceProxy implements Reorder {
  private reorderService: ReorderService;
  private logger: LogPublisher;

  constructor(reorderService: ReorderService, logger: LogPublisher) {
    this.reorderService = reorderService;
    this.logger = logger;
  }

  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    this.log("reorder", { items, startIndex, endIndex });
    return this.reorderService.reorder(items, startIndex, endIndex);
  }

  public reorderCards(params: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    this.log("reorderCards", params);
    return this.reorderService.reorderCards(params);
  }

  private log(methodName: string, params: Record<string, unknown>): void {
    this.logger.notify(
      LogLevel.INFO,
      `Calling ${methodName} with parameters: ${JSON.stringify(params)}`
    );
  }
}

const LOGS_FILE = "Reorder_Service.log";

const loggerService = new LogPublisher();
const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger(LOGS_FILE);

loggerService.addObserver(fileLogger);
loggerService.addObserver(consoleLogger);

const reorderService = new ReorderService();
const reorderServiceProxy = new ReorderServiceProxy(
  reorderService,
  loggerService
);

export { reorderServiceProxy };
