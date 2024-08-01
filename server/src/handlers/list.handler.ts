import type { Socket } from "socket.io";

import { ListEvent, LogLevel } from "../common/enums/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      const lists = this.db.getData();
      const reorderedLists = this.reorderService.reorder(
        lists,
        sourceIndex,
        destinationIndex
      );
      this.db.setData(reorderedLists);
      this.updateLists();

      this.log(
        LogLevel.INFO,
        `List reordered: ${sourceIndex} to ${destinationIndex}`
      );
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to reorder list: ${error}`);
    }
  }

  private createList(name: string): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();

      this.log(LogLevel.INFO, `List created: ${name}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to create list: ${error}`);
    }
  }

  private deleteList(listId: string): void {
    try {
      const lists = this.db.getData();
      this.db.setData(lists.filter((list) => list.id !== listId));
      this.updateLists();

      this.log(LogLevel.INFO, `List deleted: ${listId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to delete list: ${error}`);
    }
  }

  private renameList(listId: string, name: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          list.name = name;
          return list;
        }
        return list;
      });
      this.db.setData(updatedLists);
      this.updateLists();

      this.log(LogLevel.INFO, `List renamed: ${listId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to rename list: ${error}`);
    }
  }
}

export { ListHandler };
