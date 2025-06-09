import React, { useEffect, useState } from "react";
import MyModal from "./MyModal";
import { getCookie } from "../../utils/cookie";
import { get, postImage } from "../../utils/requets";
import { toast } from "react-toastify";
import { editTask } from "../../services/api/task";
import AvatarNotFound from "../../assets/avatarNotFound.jpg";
import moment from "moment";
import HeadContent from "../HeadContent";
import { FaCircle } from "react-icons/fa";
import Button from "../Button";
import { GoPlus } from "react-icons/go";
import { CiImageOn } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import ModalUser from "./ModalUser";

const ModalUpdateTask = ({
  isOpen,
  closeModal,
  Task,
  onRefresh,
  setLoadingScreen,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelects, setUserSelects] = useState([]);
  const [deletedImage, setDeletedImage] = useState(false);

  const [openModalUser, setOpenModalUser] = useState(false);

  const userLocal = useSelector((state) => state.auth.auth);

  useEffect(() => {
    let arr = [];
    if (Task.listUser.length > 0) {
      for (let i = 0; i < Task.listUser.length; i++) {
        const id = Task.listUser[i];
        const user = users.find((item) => String(item._id) === id);
        if (user) {
          arr.push({
            id: id,
            avatar: user.avatar || "",
          });
        }
        if (id === userLocal._id) {
          arr.push({
            id: id,
            avatar: userLocal.avatar || "",
          });
        }
      }
    }
    setUserSelects(arr);
  }, [Task.listUser, users]);

  useEffect(() => {
    setImagePreview(Task.thumbnail || null);
    setDeletedImage(false);
  }, [Task.thumbnail, isOpen]);

  useEffect(() => {
    const token = getCookie("token");
    const fetchData = async (token) => {
      try {
        setLoading(true);
        const response = await Promise.all([
          get("/status", token),
          get("/priority", token),
          get("/users/list-user", token),
        ]);
        for (const item of response) {
          if (!item || item.code !== 200) {
            throw new Error(item.message);
          }
        }
        const [status, priority, listUser] = response;
        setStatus(status.data);
        setPriority(priority.data);
        setUsers(listUser.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred " + error);
      }
    };
    if (token) {
      fetchData(token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    const form = e.target.elements;
    for (let i = 0; i < form.length; i++) {
      if (form[i].name) {
        if (form[i].name === "thumbnail") continue;
        if (form[i].name === "priority_id") {
          if (form[i].checked) {
            data[form[i].name] = form[i].value;
          }
        } else {
          data[form[i].name] = form[i].value;
        }
      }
    }

    const arr = userSelects.map((item) => String(item.id));
    data.listUser = arr;

    if (!data.title) {
      toast.error("Please enter title task!");
    } else if (!data.timeStart || !data.timeFinish) {
      toast.error("Please chose time for task!");
    } else if (!data["priority_id"]) {
      toast.error("Please enter chose at least one priority fo task!");
    } else {
      const token = getCookie("token");
      if (token) {
        try {
          setLoading(true);
          setLoadingScreen(true);
          if (deletedImage) {
            data.thumbnail = "";
          }
          if (file) {
            const responseUpload = await postImage(
              "task",
              "thumbnail",
              file,
              token
            );
            if (!responseUpload || responseUpload.code !== 200) {
              throw new Error("error");
            }
            data.thumbnail = responseUpload.imageUrl;
          }
          const response = await editTask(Task._id, data, token);
          if (!response || response.code !== 200) {
            throw new Error(response.message || "ERROR");
          }
          setFile(null);
          setDeletedImage(false);
          onRefresh();
          setLoadingScreen(false);
          setLoading(false);
          closeModal();
          toast.success(response.message);
        } catch (error) {
          setLoading(false);
          setLoadingScreen(false);
          toast.error("An error occurred in client " + error.message || error);
        }
      }
    }
  };

  const handlePickerImage = (e) => {
    const files = e.target.files[0];
    if (files) {
      setFile(files);
      const fakePath = URL.createObjectURL(e.target.files[0]);
      setImagePreview(fakePath);
    }
  };

  const handleDeleteFileImage = () => {
    setImagePreview(null);
    setFile(null);
    setDeletedImage(true);
    const input = document.querySelector('input[name="thumbnail"]');
    if (input) {
      input.value = "";
    }
  };

  const hideModalUser = () => {
    setOpenModalUser(false);
  };
  const showModalUser = () => {
    setOpenModalUser(true);
  };

  return (
    Task && (
      <MyModal
        width={"85%"}
        height={"85%"}
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <div className="w-full h-full">
          <div className="h-full w-full bg-white">
            <div className="h-full w-full md:p-3 p-0">
              <div className="h-full w-full flex flex-col gap-2">
                <HeadContent
                  title={"Edit Task"}
                  Left={
                    <AiOutlineClose
                      className="cursor-pointer"
                      size={20}
                      onClick={closeModal}
                    />
                  }
                />
                <form
                  action=""
                  className="overflow-y-auto scroll-none h-full md:p-3 p-0 mt-2 md:mt-0"
                  onSubmit={handleSubmit}
                >
                  <div className="flex lg:flex-row flex-col lg:gap-10 gap-3 md:border-[1.5px] md:p-4 p-0 rounded-xs border-[#A1A3AB]">
                    <div className="flex flex-col w-full lg:w-5/7 gap-4 h-full">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="title"
                          className="font-semibold text-sm"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3"
                          defaultValue={Task.title}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="timeStart"
                            className="font-semibold text-sm"
                          >
                            Time Start
                          </label>
                          <input
                            defaultValue={moment(
                              Task.timeStart || new Date()
                            ).format("yyyy-MM-DD")}
                            type="date"
                            name="timeStart"
                            id="timeStart"
                            className="border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="timeFinish"
                            className="font-semibold text-sm"
                          >
                            Time Finish
                          </label>
                          <input
                            defaultValue={moment(
                              Task.timeFinish || new Date()
                            ).format("yyyy-MM-DD")}
                            type="date"
                            name="timeFinish"
                            id="timeFinish"
                            className="border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3"
                          />
                        </div>
                      </div>
                      <div
                        className={`flex ${
                          priority.length >= 4
                            ? "flex-col gap-4"
                            : "gap-5 xl:gap-10 lg:flex-row flex-col"
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-sm">Priority</p>
                          <div
                            className={`flex gap-4 md:flex-nowrap flex-wrap ${
                              priority.length >= 4 && "flex-wrap"
                            }`}
                          >
                            {priority.map((item, index) => (
                              <div
                                className="flex gap-2 items-center"
                                key={index}
                              >
                                <label
                                  htmlFor={item.key}
                                  className={`text-sm text-[#A1A3AB]`}
                                >
                                  <div className="flex gap-2 justify-center items-center">
                                    <FaCircle
                                      size={6}
                                      className={``}
                                      color={`#${item.hex}`}
                                    />
                                    <p className="text-sm line-clamp-1">
                                      {item.title}
                                    </p>
                                  </div>
                                </label>
                                <input
                                  className="h-full"
                                  type="checkbox"
                                  name="priority_id"
                                  id={item.key}
                                  value={item._id}
                                  defaultChecked={item._id === Task.priority_id}
                                  onChange={() => {
                                    const ortherCheck =
                                      document.querySelectorAll(
                                        'input[name="priority_id"]'
                                      );
                                    for (
                                      let i = 0;
                                      i < ortherCheck.length;
                                      i++
                                    ) {
                                      if (i !== index) {
                                        ortherCheck[i].checked = false;
                                      }
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-full">
                          <p className="font-semibold text-sm">Status</p>
                          <div className="mt-1">
                            <select
                              className="border-2 border-gray-300 rounded-md py-2 md:py-0.5 px-2 md:text-sm w-2/3 text-center outline-0"
                              name="status_id"
                              defaultValue={Task.status_id}
                            >
                              {status.map((item) => (
                                <option value={item._id} key={item._id}>
                                  {" "}
                                  {item.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-2 items-center my-3">
                          <p className="font-semibold text-sm">Users</p>
                          {String(userLocal._id) === Task.user_id && (
                            <div className="">
                              <Button
                                smaller
                                title={"Add User"}
                                IconAfterHide={<GoPlus />}
                                onClick={showModalUser}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-0.5 items-center flex-wrap">
                          {userSelects.slice(0, 10).map((item, index) => (
                            <div
                              key={index}
                              className="h-10 w-10 rounded-md overflow-hidden relative"
                            >
                              <img
                                className="h-full w-full object-cover"
                                src={item.avatar || AvatarNotFound}
                                alt=""
                              />
                              {index === 9 && userSelects.length > 10 && (
                                <div className="absolute top-0 left-0 bg-black w-full h-full opacity-70 flex justify-center items-center">
                                  <p className="ml-1 text-white">
                                    +{userSelects.length - 10}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="">
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="content"
                            className="font-semibold text-sm"
                          >
                            Task description
                          </label>
                          <textarea
                            defaultValue={Task.content}
                            name="content"
                            id="content"
                            placeholder="Start writing here..."
                            className="border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3"
                            rows={7}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold text-sm">Upload Image</p>
                        <div className="h-48 border-2 rounded-xl border-gray-300 text-[#A1A3AB] overflow-hidden lg:w-auto sm:w-2/3 w-full">
                          {!imagePreview && (
                            <label
                              htmlFor="upload-image"
                              className="w-full h-full flex flex-col gap-2 items-center justify-center"
                            >
                              <CiImageOn size={50} />
                              <p>Upload your image</p>
                            </label>
                          )}
                          {imagePreview && (
                            <div className="w-full h-full relative group cursor-pointer">
                              <div className="w-full h-full relative">
                                <img
                                  src={imagePreview}
                                  alt=""
                                  className="w-full h-full"
                                />
                              </div>
                              <div
                                className="hidden absolute group-hover:flex w-full h-full top-0 items-center bg-black opacity-60 justify-center z-10"
                                onClick={handleDeleteFileImage}
                              >
                                <AiOutlineClose
                                  size={35}
                                  className="text-red-600 opacity-100"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <input
                          type="file"
                          className="hidden"
                          id="upload-image"
                          onChange={handlePickerImage}
                          name="thumbnail"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="inline-block mt-5">
                    <Button
                      title={"Done"}
                      disabled={loading}
                      typeBtn={"submit"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ModalUser
          closeModal={hideModalUser}
          isOpen={openModalUser}
          setUserSelects={setUserSelects}
          userSelects={userSelects}
          users={users}
        />
      </MyModal>
    )
  );
};

export default ModalUpdateTask;
