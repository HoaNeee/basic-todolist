import React, { useEffect, useState } from "react";
import CardTodo from "../components/CardTodo";
import { getCookie } from "../utils/cookie";
import { getAllTask } from "../services/api/task";
import { Outlet, useParams } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../redux/reducers/tasksReducer";
import ListTask from "../components/ListTask";
import Loading from "../components/Loading";

const MyTask = () => {
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const tasks = useSelector((state) => state.task.tasks);

  const dispatch = useDispatch();

  const fetchTask = async (token) => {
    try {
      setLoading(true);
      const result = await getAllTask(token);
      if (!result || result.code !== 200) {
        //error
        throw new Error(result.message || " ERROR ");
      }

      dispatch(addTask(result.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || error);
    }
  };

  useEffect(() => {
    const token = getCookie("token");
    if (token && (!tasks || tasks.length === 0)) {
      fetchTask(token);
    }
  }, []);

  useEffect(() => {
    const card = document.querySelector(`a[data-id="${params.id}"]`);
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [tasks]);

  return (
    <div className="flex w-full h-full gap-5 pb-5">
      <div className="xl:w-102 w-full h-full border-[1.5px] border-[#dadada] rounded-xl p-4 shadow-lg flex flex-col">
        <div className="w-full">
          <div className="inline-flex flex-col">
            <p className="font-semibold text-sm inline">My Tasks</p>
            <div className="inline-block h-1 w-1/2 bg-[#F24E1E] rounded-lg"></div>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="xl:flex hidden flex-col gap-3 my-2 overflow-y-auto scroll-none">
              {tasks && tasks.length > 0 && (
                <ListTask
                  Link={true}
                  onPage={true}
                  smaller={true}
                  tasks={tasks}
                />
              )}
            </div>
            {/* navigate to other page */}
            <div className="xl:hidden flex flex-col gap-3 my-2 overflow-y-auto scroll-none">
              {tasks && tasks.length > 0 && (
                <ListTask
                  Link={true}
                  onPage={false}
                  smaller={true}
                  tasks={tasks}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* view task */}
      <div className="flex-1 h-full border-[1.5px] border-[#dadada] rounded-xl p-4 shadow-lg xl:flex hidden flex-col overflow-y-auto scroll-none">
        {params && params.id ? (
          <Outlet />
        ) : (
          <>
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-[#b7b7b7]">View task at here...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyTask;
