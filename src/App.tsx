import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import Board from "./components/Board";
import { FaTrashAlt } from "react-icons/fa";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
`;

const App = () => {
  const [todos, setTodos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;

    console.log(info);

    // 보드가 하나일 때
    // setTodos((oldTodos) => {
    //   const copyTodos = [...oldTodos];
    //   copyTodos.splice(source.index, 1);
    //   copyTodos.splice(destination?.index, 0, draggableId);
    //   return copyTodos;
    // });

    // 같은 자리에 둘 경우 작동하지 않도록
    if (!destination) return;

    // 삭제
    if (destination.droppableId === "delete") {
      console.log("삭제");
      setTodos((allBoards) => {
        const boradCopy = [...allBoards[source.droppableId]];
        boradCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boradCopy,
        };
      });
      return;
    }

    if (destination?.droppableId === source.droppableId) {
      // 같은 보드에서 움직일 경우
      setTodos((allBoards) => {
        const boradCopy = [...allBoards[source.droppableId]];
        // 삭제전 복사해놓기
        const taskObj = boradCopy[source.index];
        boradCopy.splice(source.index, 1);
        boradCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boradCopy,
        };
      });
    } else if (destination?.droppableId !== source.droppableId) {
      // 보드를 이동할 때
      setTodos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const targetBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(todos).map((boardId) => (
            <Board key={boardId} boardId={boardId} todos={todos[boardId]} />
          ))}
        </Boards>
        <Droppable droppableId="delete">
          {(magic) => (
            <div ref={magic.innerRef}>
              <FaTrashAlt size={30} />
            </div>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
