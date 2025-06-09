import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";
import { changeStatus, deleteTask, getTaskDetail } from "../services/api/task";
import ImageNotFoundItem from "../assets/notfound.png";
import GoBack from "../components/GoBack";
import { formatDate, relativeTime, toTime } from "../helpers/formatDate";
import { toast } from "react-toastify";
import ButtonIcon from "../components/button/ButtonIcon";
import { FaEye } from "react-icons/fa";
import ModalUpdateTask from "../components/modal/ModalUpdateTask";
import AvatarNotFound from "../assets/avatarNotFound.jpg";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../utils/requets";
import { deleteOneTask, updateTask } from "../redux/reducers/tasksReducer";
import TooltipDelete from "../components/TooltipDelete";
import Loading from "../components/Loading";

const Detail = ({ type }) => {
  const params = useParams();
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);

  const [status, setStatus] = useState([]);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openTooltipDelete, setOpenTooltipDelete] = useState(false);

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const typeDetail = search.get("type");
  const navigate = useNavigate();

  if (typeDetail) {
    type = typeDetail;
  }

  const dispatch = useDispatch();

  const userLocal = useSelector((state) => state.auth.auth);

  useEffect(() => {
    const token = getCookie("token");
    const fetchData = async (token) => {
      try {
        setLoading(true);
        const response = await get("/status", token);
        if (!response || response.code !== 200) {
          throw new Error(response.message || "Error");
        }
        setStatus(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred " + error);
      }
    };
    if (token) {
      fetchData(token);
      fetchTaskDetail(token, params.id);
    }
  }, [params.id]);

  const fetchTaskDetail = async (token, id, type = 1) => {
    try {
      setLoading(true);
      const result = await getTaskDetail(token, id);
      if (!result || result.code !== 200) {
        throw new Error(result.message || "Error");
      }
      if (type === 2) {
        dispatch(
          updateTask({
            id: result.data._id,
            data: result.data,
          })
        );
      }
      setTaskDetail(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      navigate("/my-task");
      toast.error(error.message || error);
    }
  };

  const showUpdateTask = () => {
    setOpenModalUpdate(true);
  };
  const hideUpdateTask = () => {
    setOpenModalUpdate(false);
  };

  const hideDeleteTask = () => {
    setOpenTooltipDelete(false);
  };

  const handleChangeStatus = async (e) => {
    const value = e.target.selectedOptions[0].value;
    const title = e.target.selectedOptions[0].dataset.titleStatus;
    const hex = e.target.selectedOptions[0].dataset.hexStatus;
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        const response = await changeStatus(
          taskDetail._id,
          {
            status_id: value,
          },
          token
        );
        if (!response || response.code !== 200) {
          throw new Error(response.message || " Error ");
        }

        const object = {
          status_id: value,
          status: title,
          statusColor: hex,
        };
        if (title === "Completed") {
          object.completedAt = new Date().toISOString();
        }
        toast.success(response.message);

        setTaskDetail({
          ...taskDetail,
          ...object,
        });
        dispatch(
          updateTask({
            id: taskDetail._id,
            data: {
              ...taskDetail,
              ...object,
            },
          })
        );
        setLoadingScreen(false);
      } catch (error) {
        setLoadingScreen(false);
        toast.error(error.message || error);
      }
    }
  };

  const handleDeleteTask = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        const response = await deleteTask(taskDetail._id, token);
        if (!response || response.code !== 200) {
          throw new Error(response.message || " ERROR ");
        }
        toast.success(response.message);
        dispatch(
          deleteOneTask({
            id: taskDetail._id,
          })
        );
        setTaskDetail(null);
        hideDeleteTask();
        navigate("/my-task");
        setLoadingScreen(false);
      } catch (error) {
        setLoadingScreen(false);
        toast.error(error.message || error);
      }
    }
  };

  return (
    <>
      {loadingScreen && <Loading typeLoading={"screen"} />}
      {loading ? (
        <Loading />
      ) : taskDetail ? (
        <div className={`w-full h-full ${type === "page" ? "pb-5" : ""}`}>
          <div
            className={`h-full relative flex flex-col justify-between overflow-y-auto scroll-none ${
              type === "page"
                ? "border-[1.5px] border-[#dadada] rounded-xl p-4 shadow-lg"
                : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <div className="h-36 w-36 rounded-2xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={taskDetail.thumbnail || ImageNotFoundItem}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <p
                    className={`font-semibold ${
                      type === "page" ? "text-lg" : ""
                    }`}
                  >
                    {taskDetail.title || "this is the title task"}{" "}
                  </p>
                  <p className={`${type === "page" ? "text-sm" : "text-xs"}`}>
                    Priority:{" "}
                    <span
                      className=""
                      style={{
                        color: `#${taskDetail.priorityColor || "bababa"}`,
                      }}
                    >
                      {taskDetail.priority || "not data"}
                    </span>
                  </p>
                  <p className={`${type === "page" ? "text-sm" : "text-xs"}`}>
                    Status:{" "}
                    <select
                      name="status_id"
                      className="select-status-detail-task outline-0 px-2"
                      style={{
                        color: `#${taskDetail.statusColor}`,
                      }}
                      value={taskDetail && taskDetail.status_id}
                      onChange={handleChangeStatus}
                    >
                      {status.map((sta) => (
                        <option
                          key={sta._id}
                          value={sta._id}
                          className=""
                          style={{
                            color: `#${sta.hex || "bababa"}`,
                          }}
                          data-title-status={sta.title}
                          data-hex-status={sta.hex}
                        >
                          {sta.title || "not data"}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p className="text-[10px] text-[#A1A3AB]">
                    {taskDetail.status === "Completed"
                      ? `Completed ${relativeTime(taskDetail.completedAt)}`
                      : `Created on: ${formatDate(taskDetail.createdAt)}`}
                  </p>
                </div>
              </div>
              <div
                className={`mt-3 text-[#747474] flex flex-col gap-1 ${
                  type === "page" ? "" : "text-sm"
                }`}
              >
                <p>
                  <b>Task Title</b>:{" "}
                  {taskDetail.title || "this is the title task"}
                </p>

                <p>
                  <b>Task Description</b>:{" "}
                  {taskDetail.content || "this is the description"}
                </p>
                <div>
                  <b>Additional Notes:</b>
                  <p>No have any notes</p>
                </div>

                <p>
                  <b>Deadline for Submission</b>:{" "}
                  {taskDetail.status === "Completed"
                    ? `Completed`
                    : `${toTime(taskDetail.timeFinish)}`}
                </p>
                {taskDetail.userCreate && (
                  <div className="mt-4 text-sm">
                    <b className="block">CreatedBy: </b>
                    <div className="inline-flex py-2 px-3 rounded-md mt-2 gap-3 border border-gray-200">
                      <img
                        className="h-[54px] w-[54px] rounded-xl object-cover"
                        src={taskDetail.userCreate.avatar || AvatarNotFound}
                        alt=""
                      />
                      {
                        <div className="">
                          <p>{taskDetail.userCreate.fullname || ""}</p>
                          <p className="text-xs mt-0.5">
                            {taskDetail.userCreate.email}
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex mt-2 gap-1 justify-end">
              {(!type || type !== "page") && (
                <Link to={`/detail/${params.id}?type=page`}>
                  <ButtonIcon Icon={<FaEye />} />
                </Link>
              )}
              {userLocal._id === taskDetail.user_id && (
                <div data-tooltip-id="my-tooltip-delete">
                  <ButtonIcon Icon={<MdDelete />} />
                </div>
              )}
              <ButtonIcon Icon={<FiEdit />} onClick={showUpdateTask} />
            </div>
            {type === "page" && (
              <div className="absolute top-1 md:top-3 right-3 text-sm font-semibold underline">
                <GoBack />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-[#b7b7b7]">View task at here...</p>
        </div>
      )}
      {taskDetail && (
        <ModalUpdateTask
          isOpen={openModalUpdate}
          closeModal={hideUpdateTask}
          Task={taskDetail}
          onRefresh={() => {
            const token = getCookie("token");
            fetchTaskDetail(token, params.id, 2);
          }}
          setLoadingScreen={setLoadingScreen}
        />
      )}
      <TooltipDelete
        id={"my-tooltip-delete"}
        onCancel={hideDeleteTask}
        openTooltip={openTooltipDelete}
        setOpenTooltip={setOpenTooltipDelete}
        theme={""}
        onOk={handleDeleteTask}
      />
    </>
  );
};

export default Detail;
