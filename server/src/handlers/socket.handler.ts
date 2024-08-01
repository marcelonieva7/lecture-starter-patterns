import { Server, Socket } from "socket.io";

import { ListEvent } from "../common/enums/enums";
import { Database } from "../data/database";
import { ReorderService } from "../services/reorder.service";
import { LogPublisher } from "../services/logger/loggerPublisher";
import { type LogLevel } from "../common/types/types";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderService;

  protected io: Server;

  protected logPublisher: LogPublisher;

  public constructor(
    io: Server,
    db: Database,
    reorderService: ReorderService,
    logPublisher: LogPublisher
  ) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.logPublisher = logPublisher;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }

  protected log(logLevel: LogLevel, message: string): void {
    this.logPublisher.notify(logLevel, message);
  }
}

export { SocketHandler };
