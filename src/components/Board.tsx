import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "./../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 20px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "red"
      : props.draggingFromThisWith
      ? "green"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    border: none;
    outline: none;
    background-color: transparent;
    border-bottom: 2px solid ${(props) => props.theme.cardColor};
    margin-right: 10px;
  }
  button {
    background-color: #aa5656;
    outline: none;
    border: none;
    border-radius: 10px;
    padding: 5px 10px;
    color: white;
  }
`;

interface IAreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

interface IBoardProps {
  todos: ITodo[];
  boardId: string;
}

interface IForm {
  todo: string;
}

const Board = ({ todos, boardId }: IBoardProps) => {
  const setTodos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ todo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        // board를 추가하는 것이 아니라 찾아야 하니까 []
        [boardId]: [...allBoards[boardId], newTodo],
      };
    });
    setValue("todo", "");
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("todo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
        <button type="submit">ADD</button>
      </Form>

      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {todos.map((todo, index) => (
              // key 와 draggableId 가 같지 않으면 버그
              <DraggableCard
                key={todo.id}
                index={index}
                todoId={todo.id}
                todoText={todo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
