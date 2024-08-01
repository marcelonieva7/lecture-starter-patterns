import type { Socket } from "socket.io";

import { CardEvent, LogLevel } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(
      CardEvent.CHANGE_DESCRIPTION,
      this.changeCardDescription.bind(this)
    );
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CLONE, this.cloneCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    try {
      const newCard = new Card(cardName, "");
      const lists = this.db.getData();

      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      this.log(LogLevel.INFO, `Card created: ${cardName} in list ${listId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to create card: ${error}`);
    }
  }

  public cloneCard(cardId: string): void {
    try {
      const lists = this.db.getData();
      let cardToClone: Card;
      let listId: string;

      lists.some((list) => {
        cardToClone = list.cards.find((card) => card.id === cardId);
        listId = list.id;
        return cardToClone;
      });
      const newCard = cardToClone.clone();
      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      this.log(LogLevel.INFO, `Card cloned: ${cardId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to clone card: ${error}`);
    }
  }

  public changeCardDescription(cardId: string, description: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = lists.map((list) =>
        list.setCards(
          list.cards.map((card) => {
            if (card.id === cardId) {
              card.description = description;
            }
            return card;
          })
        )
      );
      this.db.setData(updatedLists);
      this.updateLists();

      this.log(LogLevel.INFO, `Card description changed: ${cardId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to change card description: ${error}`);
    }
  }

  public deleteCard(cardId: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = lists.map((list) =>
        list.setCards(list.cards.filter((card) => card.id !== cardId))
      );
      this.db.setData(updatedLists);
      this.updateLists();

      this.log(LogLevel.INFO, `Card deleted: ${cardId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to delete card: ${error}`);
    }
  }

  public renameCard(cardId: string, name: string): void {
    try {
      const lists = this.db.getData();
      const updatedLists = lists.map((list) =>
        list.setCards(
          list.cards.map((card) => {
            if (card.id === cardId) {
              card.name = name;
            }
            return card;
          })
        )
      );
      this.db.setData(updatedLists);
      this.updateLists();

      this.log(LogLevel.INFO, `Card renamed: ${cardId}`);
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to rename card: ${error}`);
    }
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    try {
      const lists = this.db.getData();
      const reordered = this.reorderService.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
      });
      this.db.setData(reordered);
      this.updateLists();

      this.log(
        LogLevel.INFO,
        `Cards reordered: ${sourceListId} to ${destinationListId}`
      );
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to reorder cards: ${error}`);
    }
  }
}

export { CardHandler };
