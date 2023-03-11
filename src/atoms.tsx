import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 사용자가 다른 borad 를 더 추가할 수 있으니 key 는 string 이라고 지정하고 값으로는 string 배열을 가질거라 지정
interface ITodoState {
  [key: string]: ITodo[];
}

export interface ITodo {
  id: number;
  text: string;
}

export const toDoState = atom<ITodoState>({
  key: "todo",
  default: {
    Todo: [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});
