import { CiSearch } from "react-icons/ci";
import { FaRegBell, FaBars, FaSleigh } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router";
import { dayOfWeek, formatDate } from "../helpers/formatDate";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { TiArrowBack } from "react-icons/ti";
import { toast, Zoom } from "react-toastify";
import { get, patch } from "../utils/requets";
import { getCookie } from "../utils/cookie";
import { socket } from "../socket/socket";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [loading, setLoading] = useState(FaSleigh);

  const navigate = useNavigate();

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const keyword = search.get("keyword");
  const user = useSelector((state) => state.auth.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = e.target.elements[0].value;
    navigate(`/search?keyword=${keyword}`);
  };

  useEffect(() => {
    const token = getCookie("token");
    socket.connect();

    fetchNotify(token);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const notifyHelp = (data) => {
      const userId = data?.user_id || "";
      if (String(user._id) === userId) {
        toast(toastNotify, {
          transition: Zoom,
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 1500,
          pauseOnHover: false,
        });
        setNotifications([...notifications, data]);
      }
    };

    socket.on("SERVER_RETURN_CREATE_NEW_TASK", (data) => {
      notifyHelp(data);
    });

    socket.on("SERVER_RETURN_UPDATE_STATUS_TASK", (data) => {
      notifyHelp(data);
    });
    socket.on("SERVER_RETURN_UPDATE_USER_TASK", (data) => {
      notifyHelp(data);
    });
    return () => {
      socket.off("SERVER_RETURN_CREATE_NEW_TASK");
      socket.off("SERVER_RETURN_UPDATE_STATUS_TASK");
      socket.off("SERVER_RETURN_UPDATE_USER_TASK");
    };
  }, [user]);

  useEffect(() => {
    const token = getCookie("token");
    if (token && openTooltip) {
      fetchNotify(token);
    }
  }, [openTooltip]);

  const fetchNotify = async (token) => {
    try {
      setLoading(true);
      const response = await get("/notify", token);
      if (!response || response.code !== 200) {
        throw new Error(response.message || "ERROR");
      }
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || error);
    }
  };

  const handleToTask = async (notify) => {
    const token = getCookie("token");
    if (token && !notify.isRead) {
      try {
        const response = await patch(
          "/notify/read/" + notify._id,
          {
            isRead: true,
          },
          token
        );
        if (!response || response.code !== 200) {
          throw new Error(response.message || "ERROR");
        }
      } catch (error) {
        toast.error(error.message || error);
      }
    }
    setOpenTooltip(false);
  };

  const toastNotify = () => {
    return (
      <div>
        <p
          style={{
            fontWeight: "bold",
          }}
        >
          You have new notifications
        </p>
      </div>
    );
  };

  return (
    <header className="w-full bg-[#F8F8F8] flex justify-center shadow-md fixed top-0 left-0 z-30">
      <div className="container xl:px-4 flex justify-between items-center py-6 px-1">
        <p className="font-semibold text-3xl text-[#FF6767]">
          To-<span className="text-black">Do</span>
        </p>

        <form action="" onSubmit={handleSearch}>
          <div className="bg-[#F5F8FF] xl:w-2xl lg:w-xl md:w-xs  md:flex hidden shadow-md rounded-lg items-center">
            <input
              className="block flex-1 outline-0 text-sm pl-3 font-medium "
              type="text"
              name="keyword"
              id=""
              placeholder="Search your task here..."
              defaultValue={keyword || ""}
            />
            <button
              type="submit"
              className="p-2 bg-[#FF6767] h-full inline-block rounded-lg cursor-pointer"
            >
              <CiSearch className="text-white text-2xl" />
            </button>
          </div>
        </form>

        <div className="md:flex gap-8 hidden">
          <div className="flex gap-2 relative">
            <button
              className="px-3 bg-[#FF6767] inline-block rounded-lg cursor-pointer relative"
              data-tooltip-id="tooltip-notify"
              data-tooltip-offset={4}
            >
              <FaRegBell className="text-white" />
              {notifications &&
                notifications.length > 0 &&
                notifications.some((item) => !item.isRead) && (
                  <div className="inline-block absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-700" />
                )}
            </button>

            <button className="px-3 bg-[#FF6767] inline-block rounded-lg cursor-pointer">
              <SlCalender className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm">{dayOfWeek(new Date())}</p>
            <p className="text-sm text-blue-600">{formatDate(new Date())}</p>
          </div>
        </div>

        <div className="md:hidden">
          <button>
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>

      {/* tooltip */}
      <Tooltip
        id="tooltip-notify"
        place="bottom-center"
        classNameArrow="hidden"
        style={{
          borderRadius: "8px",
          padding: 0,
          overflow: "hidden",
          backgroundColor: "#D3D3D3",
        }}
        clickable
        openEvents={{
          click: true,
        }}
        closeEvents={{
          click: true,
        }}
        globalCloseEvents={{
          clickOutsideAnchor: true,
          scroll: true,
        }}
        isOpen={openTooltip}
        setIsOpen={setOpenTooltip}
        noArrow
        opacity={1}
      >
        <div className={`min-h-54 h-84 w-74 flex flex-col`}>
          <div className="h-full max-h-2/11 bg-white text-black px-4 border-b border-gray-300">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Notifications</p>
              <TiArrowBack color="#FF6767" size={30} />
            </div>
            <span className="text-sm text-[#A1A3AB]">Today</span>
          </div>

          {loading ? (
            <div className="h-full w-full">
              <Loading />
            </div>
          ) : notifications.length > 0 ? (
            <div className="bg-[#D3D3D3] h-full flex flex-col overflow-y-auto">
              {notifications.map((item) => (
                <NavLink
                  key={item._id}
                  className={`${
                    item.isRead
                      ? "bg-white hover:bg-[#e2dddd]"
                      : "hover:bg-gray-300"
                  } cursor-pointer block`}
                  onClick={() => handleToTask(item)}
                  to={`/detail/${item.task_id}${
                    location.search ? location.search : "?type=page"
                  }`}
                >
                  <div className="flex items-center gap-1 justify-between px-2 py-3">
                    <div className="text-[13px] text-black flex-1 flex flex-col gap-1">
                      <p className="max-w-full">
                        {item.title || ""}
                        {":"} <b>{item?.task?.title || ""}</b>
                      </p>
                      <span className="text-xs">
                        Priority:{" "}
                        <span
                          style={{
                            color: `#${item?.task?.priorityColor || ""}`,
                          }}
                        >
                          {item?.task?.priority || ""}
                        </span>
                      </span>
                    </div>
                    {item?.task?.thumbnail && (
                      <div className="h-[52px] w-[52px] rounded-sm overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={item.task.thumbnail || ""}
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="flex-1 w-full flex justify-center items-center">
                <p className="text-[#4f4f4f]">
                  You don't have any notifications
                </p>
              </div>
            )
          )}
        </div>
      </Tooltip>
    </header>
  );
};

export default Header;
