import React, { useEffect, useState } from "react";
import IconWaveHand from "../assets/wavehand2.png";
import { HiOutlineClipboardList } from "react-icons/hi";
import { GoPlus } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import { GoChecklist } from "react-icons/go";
import Chart from "react-apexcharts";
import { FaCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getCookie } from "../utils/cookie";
import { getAllTask } from "../services/api/task";
import ListTask from "../components/ListTask";
import Loading from "../components/Loading";

const HomePage = () => {
  const [state, setState] = useState({
    completed: {
      options: {
        colors: ["#05A301"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: 0,
                fontSize: "19px",
                fontWeight: "700",
              },
            },
          },
        },
        legend: {
          show: false,
        },
        theme: {
          monochrome: {
            enabled: false,
          },
        },
      },
      series: [100],
    },
    doing: {
      options: {
        colors: ["#0225FF"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: 0,
                fontSize: "19px",
                fontWeight: "700",
              },
            },
          },
        },
        legend: {
          show: false,
        },
        theme: {
          monochrome: {
            enabled: false,
          },
        },
      },
      series: [100],
    },
    initial: {
      options: {
        colors: ["#F21E1E"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: 0,
                fontSize: "19px",
                fontWeight: "700",
              },
            },
          },
        },
        legend: {
          show: false,
        },
        theme: {
          monochrome: {
            enabled: false,
          },
        },
      },
      series: [100],
    },
  });

  const [taskTodo, setTaskTodo] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState([]);

  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.auth);
  const userName = user
    ? user.fullname
      ? user?.fullname
          ?.split(" ")
          .map((item) => item[0].toUpperCase() + item.substr(1))
      : ""
    : "";

  useEffect(() => {
    const token = getCookie("token");

    const fetchAllTask = async (token) => {
      setLoading(true);
      return Promise.all([
        getAllTask(token, "initial"),
        getAllTask(token, "doing"),
        getAllTask(token, "completed"),
      ]);
    };

    if (token) {
      fetchAllTask(token)
        .then((data) => {
          const [taskInitial, taskDoing, taskCompleted] = data;
          if (
            !taskInitial ||
            !taskDoing ||
            !taskCompleted ||
            data.some((item) => item.code !== 200)
          ) {
            throw new Error();
          }
          setState({
            completed: {
              ...state.completed,
              series: [
                Number(
                  (taskCompleted.totalFilter / taskCompleted.totalTask || 1) *
                    100
                ).toFixed(0) || 100,
              ],
            },
            doing: {
              ...state.doing,
              series: [
                Number(
                  (taskDoing.totalFilter / taskDoing.totalTask || 1) * 100
                ).toFixed(0) || 100,
              ],
            },
            initial: {
              ...state.initial,
              series: [
                Number(
                  (taskInitial.totalFilter / taskInitial.totalTask || 1) * 100
                ).toFixed(0) || 100,
              ],
            },
          });
          setTaskCompleted(taskCompleted.data.slice(0, 2));
          setTaskTodo(taskInitial.data.slice(0, 2));
          setTaskTodo((prev) => {
            let arr = [...prev];
            arr.push(taskDoing.data.slice(0, 1));
            arr = arr.flat(1);
            return arr;
          });
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div className="inline-flex items-center gap-1">
          <p className="lg:text-3xl md:text-2xl text-xl md:font-medium font-semibold">
            Welcome back, {userName ? userName[userName.length - 1] : "User"}{" "}
          </p>
          <div className="w-[32px] h-[32px] md:w-[42px] md:h-[42px] overflow-hidden">
            <img src={IconWaveHand} className="w-full h-full" />
          </div>
        </div>
        <div>{/* list user do later */}</div>
      </div>
      <div className="p-2 flex-1 h-full border-1 border-[#A1A3AB] mb-4 mt-2 rounded-[2px] overflow-y-auto xl:overflow-hidden scroll-none">
        <div className="h-full w-full p-2 flex xl:flex-row flex-col xl:gap-3">
          <div className="p-3 shadow-lg rounded-xl xl:max-h-full xl:h-full xl:w-1/2 xl:overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <HiOutlineClipboardList className="text-[#A1A3AB] text-2xl" />
                <p className="text-sm text-[#FF6767] font-medium">To-do</p>
              </div>
              <div className="flex items-center gap-1">
                <GoPlus className="text-[#FF6767] text-xl" />
                <p className="text-xs text-[#A1A3AB]">Add Task</p>
              </div>
            </div>

            {/* list-card */}
            {loading && <Loading />}
            <div className="min-h-60 xl:h-full pb-9 mt-2 xl:overflow-y-auto scroll-none">
              {taskTodo && taskTodo.length > 0 ? (
                <ListTask
                  Link={true}
                  smaller={false}
                  tasks={taskTodo}
                  onPage={false}
                />
              ) : (
                <div className="flex items-center justify-center h-60 xl:h-full">
                  <p className="text-[#bababa]">No task at here...</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col xl:max-w-1/2">
            <div className="shadow-lg rounded-xl p-3 mb-5">
              <div className="flex gap-2">
                <GoChecklist className="text-[#A1A3AB] text-xl" />
                <p className="text-[#FF6767] text-sm">Task Status</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3">
                <div className="mx-auto">
                  <Chart
                    options={state.completed.options}
                    type="radialBar"
                    series={state.completed.series}
                    width={"160"}
                  />
                  <div className="flex gap-2 justify-center items-center">
                    <FaCircle size={6} className="text-[#05A301]" />
                    <p className="text-sm">Completed</p>
                  </div>
                </div>
                <div className="mx-auto">
                  <Chart
                    options={state.doing.options}
                    type="radialBar"
                    series={state.doing.series}
                    width={"160"}
                  />
                  <div className="flex gap-2 justify-center items-center">
                    <FaCircle size={6} className="text-[#0225FF]" />
                    <p className="text-sm">Doing</p>
                  </div>
                </div>
                <div className="mx-auto">
                  <Chart
                    options={state.initial.options}
                    type="radialBar"
                    series={state.initial.series}
                    width={"160"}
                  />
                  <div className="flex gap-2 justify-center items-center">
                    <FaCircle size={6} className="text-[#F21E1E]" />
                    <p className="text-sm">Initial</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="shadow-lg rounded-xl p-3 flex-1 overflow-hidden">
              <div className="flex gap-2">
                <BiTask className="text-[#A1A3AB] text-xl" />
                <p className="text-[#FF6767] text-sm font-medium">
                  Completed Task
                </p>
              </div>
              {/* list card */}
              {loading && <Loading />}
              <div className="mt-2 px-5 xl:overflow-y-auto xl:h-full scroll-none xl:pb-9">
                {taskCompleted && taskCompleted.length > 0 ? (
                  <ListTask
                    tasks={taskCompleted}
                    Link={true}
                    onPage={false}
                    footerCol
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-40">
                    <p className="text-[#bababa]">No task at here...</p>
                  </div>
                )}
              </div>
            </div>
            <div className="h-2 block xl:hidden"></div>
          </div>
        </div>
        {/* <div className="h-2 w-full"></div> */}
      </div>
    </div>
  );
};

export default HomePage;
