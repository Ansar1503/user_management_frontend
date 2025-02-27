import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./Redux/Hook";
import { setTodo } from "./Redux/TodoSlice";

function Todo() {
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state=>state.todo)
  function handlesubmit(){
    dispatch(setTodo(input))
  }
  return (
    <>
      <input
        onChange={(e) => {
          setInput(e.target.value);
        }}
        type="text"
        name=""
        id=""
      />
      <button onClick={handlesubmit}>add</button>
      <br />

      <ul>
        {todos && todos.map(todo=>{
            <li>{todo}</li>
        })}
      </ul>
    </>
  );
}

export default Todo;
