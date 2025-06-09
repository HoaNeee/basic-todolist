import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    addTask: (state, actions) => {
      state.tasks = actions.payload;
    },
    updateTask: (state, actions) => {
      const id = (actions.payload && actions.payload.id) || "";
      const data = (actions.payload && actions.payload.data) || {};
      const idx = state.tasks.findIndex((item) => item._id === id);
      if (idx !== -1) {
        state.tasks[idx] = data;
      }
    },
    addOneTask: (state, actions) => {
      state.tasks.push(actions.payload);
    },
    deleteOneTask: (state, actions) => {
      const id = actions.payload.id;
      state.tasks = state.tasks.filter((item) => item._id !== id);
    },
  },
});

export const { addTask, updateTask, addOneTask, deleteOneTask } =
  taskSlice.actions;

export default taskSlice.reducer;
