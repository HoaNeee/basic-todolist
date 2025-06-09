import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { getAllTask } from "../services/api/task";
import { getCookie } from "../utils/cookie";
import ListTask from "../components/ListTask";
import Loading from "../components/Loading";

const SearchResult = () => {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const keyword = search.get("keyword");

  const [tasks, setTasks] = useState([]);
  const getTask = async (token, keyword) => {
    try {
      setLoading(true);
      const response = await getAllTask(token, "", keyword);
      if (!response || response.code !== 200) {
        throw new Error(response.message || "ERROR");
      }
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || error);
    }
  };
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      getTask(token, keyword);
    }
  }, [keyword]);

  return (
    <div className="flex w-full h-full gap-5 pb-5">
      <div className="w-full h-full border-[1.5px] border-[#dadada] rounded-xl p-4 shadow-lg flex flex-col">
        <p className="font-medium">Search Result</p>
        {loading ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-lg text-gray-400">No result</p>
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden">
            <div className="my-2 overflow-y-auto scroll-none h-full pb-10">
              {tasks && tasks.length > 0 && (
                <ListTask
                  Link={true}
                  onPage={false}
                  tasks={tasks}
                  location={location.search}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
