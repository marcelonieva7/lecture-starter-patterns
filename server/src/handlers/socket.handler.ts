import { Server, Socket } from "socket.io";

import { ListEvent } from "../common/enums/enums";
import { Database } from "../data/database";
import { type LogPublisher } from "../services/logger/loggerPublisher";
import { type Reorder } from "../services/reorder/types";
import { type LogLevel } from "../common/types/types";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: Reorder;

  protected io: Server;

  protected logPublisher: LogPublisher;

  public constructor(
    io: Server,
    db: Database,
    reorderService: Reorder,
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
