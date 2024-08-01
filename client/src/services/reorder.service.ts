import type { DraggableLocation } from "@hello-pangea/dnd";
import * as R from "ramda";

import { type Card, type List } from "../common/types/types";

const getListById = (id: string, lists: List[]) =>
  R.find(R.propEq(id, "id"), lists);

const updateList = (listId: string, newCards: Card[], lists: List[]) =>
  R.map(
    (list) => (list.id === listId ? { ...list, cards: newCards } : list),
    lists
  );

const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number
): List[] => {
  return R.move(startIndex, endIndex, items);
};
const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const sourceList = getListById(source.droppableId, lists);
  const destinationList = getListById(destination.droppableId, lists);

  if (!sourceList || !destinationList) return lists;

  const sourceCards = R.propOr<Card[], List, Card[]>([], "cards", sourceList);
  const destinationCards = R.propOr<Card[], List, Card[]>(
    [],
    "cards",
    destinationList
  );

  const movedCard = sourceCards[source.index];
  const updatedSourceCards = R.remove(source.index, 1, sourceCards);
  const isMovingInSameList = source.droppableId === destination.droppableId;

  if (isMovingInSameList) {
    const destinationCards = R.insert(
      destination.index,
      movedCard,
      updatedSourceCards
    );
    return updateList(source.droppableId, destinationCards, lists);
  }

  const updatedDestinationCards = R.insert(
    destination.index,
    movedCard,
    destinationCards
  );

  return R.pipe(
    R.partial(updateList, [source.droppableId, updatedSourceCards, lists]),
    R.partial(updateList, [
      destination.droppableId,
      updatedDestinationCards,
      lists,
    ])
  )(lists);
};

export { reorderLists, reorderCards };
