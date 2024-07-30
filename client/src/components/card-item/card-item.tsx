import { useContext } from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CardEvent } from "../../common/enums/card-event.enum";
import { SocketContext } from "../../context/socket";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
};

export const CardItem = ({ card, isDragging, provided }: Props) => {
  const socket = useContext(SocketContext);
  const onEditCardDescription = (description: string) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, card.id, description);
  };
  const onDeleteCard = () => {
    socket.emit(CardEvent.DELETE, card.id);
  };
  const onRenameCard = (name: string) => {
    socket.emit(CardEvent.RENAME, card.id, name);
  };
  const onCloneCard = () => {
    socket.emit(CardEvent.CLONE, card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={onRenameCard}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text text={card.description} onChange={onEditCardDescription} />
        <Footer>
          <DeleteButton onClick={onDeleteCard} />
          <Splitter />
          <CopyButton onClick={onCloneCard} />
        </Footer>
      </Content>
    </Container>
  );
};
