import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import taskReducer from "./reducers/tasksReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});

export default store;
