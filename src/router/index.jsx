import { createBrowserRouter } from "react-router";
import LayoutDefault from "../layout/LayoutDefault";
import HomePage from "../pages/HomePage";
import MyTask from "../pages/MyTask";
import Detail from "../pages/Detail";
import AddTask from "../pages/AddTask";
import TaskCategory from "../pages/TaskCategory";
import LayoutAuth from "../layout/LayoutAuth";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Setting from "../pages/Setting";
import Color from "../pages/Color";
import InfoUser from "../pages/InfoUser";
import SearchResult from "../pages/SearchResult";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "my-task",
        element: <MyTask />,
        children: [
          {
            path: "detail/:id",
            element: <Detail />,
          },
        ],
      },
      {
        path: "detail/:id",
        element: <Detail />,
      },
      {
        path: "add-task",
        element: <AddTask />,
      },
      {
        path: "task-category",
        element: <TaskCategory />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
      {
        path: "color",
        element: <Color />,
      },
      {
        path: "my-info",
        element: <InfoUser />,
      },
      {
        path: "search",
        element: <SearchResult />,
      },
    ],
  },
  {
    path: "/auth",
    element: <LayoutAuth />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
