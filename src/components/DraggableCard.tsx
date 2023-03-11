import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.li<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#ffcf91" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "none"};
`;

interface IDraggableCard {
  todoId: number;
  todoText: string;
  index: number;
}

const DraggableCard = ({ todoId, todoText, index }: IDraggableCard) => {
  // 많은 랜더링이 일어나서 화면에서도 글씨의 흔들림이 있음, 이것은 react 의 특성인 state 가 바뀔 때마다 랜더링되는 점 때문에 일어나는 일 => 그래서 useMemo 를 사용
  // console.log(todoText, "is rendered");

  return (
    <Draggable draggableId={todoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {todoText}
        </Card>
      )}
    </Draggable>
  );
};

// react memo 는 react 에게 prop 이 바뀌지 않는다면 컴포넌트를 랜더링 하지 말아달라고 함
export default React.memo(DraggableCard);
