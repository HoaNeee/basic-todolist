import React, { useEffect, useRef, useState } from "react";
import MyModal from "./MyModal";
import AddTask from "../../pages/AddTask";
import { useNavigate } from "react-router";
import { getCookie } from "../../utils/cookie";
import { get, postImage } from "../../utils/requets";
import { toast } from "react-toastify";
import { addTask } from "../../services/api/task";
import AvatarNotFound from "../../assets/avatarNotFound.jpg";
import moment from "moment";
import HeadContent from "../HeadContent";
import { FaCircle } from "react-icons/fa";
import Button from "../Button";
import { GoPlus } from "react-icons/go";
import { CiImageOn, CiSearch } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";

const ModalAddTask = ({ isOpen, closeModal }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelects, setUserSelects] = useState([]);

  const inputCheckRef = useRef();

  const [openModalUser, setOpenModalUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (inputCheckRef.current) {
      if (userSelects.length === users.length) {
        inputCheckRef.current.checked = true;
      } else {
        inputCheckRef.current.checked = false;
      }
    }
  }, [userSelects]);

  useEffect(() => {
    const token = getCookie("token");
    const fetchData = async (token) => {
      try {
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
      } catch (error) {
        toast.error("An error occurred " + error);
      }
    };
    if (token) {
      fetchData(token);
    }
  }, []);

  const handlePickerImage = (e) => {
    const files = e.target.files[0];
    if (files) {
      setFile(files);
      const fakePath = URL.createObjectURL(e.target.files[0]);
      setImagePreview(fakePath);
    }
  };

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
    if (userSelects.length > 0) {
      const arr = userSelects.map((item) => String(item.value));
      data.listUser = arr;
    }
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
          const response = await addTask(data, token);
          if (!response || response.code !== 200) {
            throw new Error("error");
          }

          setLoading(false);
          toast.success(response.message);
          navigate(`/detail/${String(response.data._id)}?type=page`);
        } catch (error) {
          setLoading(false);
          toast.error("An error occurred " + error.message || error);
        }
      }
    }
  };

  const handleDeleteFileImage = () => {
    setImagePreview(null);
    setFile(null);
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

  let arrUserSelect = [...userSelects];
  const hanldeChangeCheckUser = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const imgUrl = e.target.dataset.imgUrl;
    if (checked) {
      arrUserSelect.push({
        value: value,
        imgUrl: imgUrl,
      });
    } else {
      arrUserSelect = arrUserSelect.filter((item) => item.value !== value);
    }
    setUserSelects(arrUserSelect);
  };

  const handleCheckAllUSer = (e) => {
    const checked = e.target.checked;
    const allInputCheck = document.querySelectorAll("input[data-img-url]");
    if (allInputCheck && allInputCheck.length > 0) {
      for (const item of allInputCheck) {
        item.checked = checked;
        const value = item.value;
        const imgUrl = item.dataset.imgUrl;
        if (checked) {
          if (!arrUserSelect.find((item) => item.value === value)) {
            arrUserSelect.push({
              value: value,
              imgUrl: imgUrl,
            });
          }
        } else {
          arrUserSelect = arrUserSelect.filter((item) => item.value !== value);
        }
      }
    }
    setUserSelects(arrUserSelect);
  };
  return (
    <MyModal
      width={"85%"}
      height={"85%"}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="w-full h-full">
        <div className="h-full w-full bg-white">
          <div className="p-3 h-full w-full">
            <div className="h-full w-full flex flex-col gap-2">
              <HeadContent title={"Add New Task"} />
              <form
                action=""
                className="p-3 overflow-y-auto scroll-none h-full"
                onSubmit={handleSubmit}
              >
                <div className="flex lg:flex-row flex-col lg:gap-10 gap-3 border-[1.5px] p-4 rounded-xs border-[#A1A3AB]">
                  <div className="flex flex-col w-full lg:w-5/7 gap-4 h-full">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="title" className="font-semibold text-sm">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3"
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
                          defaultValue={moment(new Date()).format("yyyy-MM-DD")}
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
                          defaultValue={moment(new Date()).format("yyyy-MM-DD")}
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
                                onChange={() => {
                                  const ortherCheck = document.querySelectorAll(
                                    'input[name="priority_id"]'
                                  );
                                  for (let i = 0; i < ortherCheck.length; i++) {
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
                        <div className="">
                          <Button
                            smaller
                            title={"Add User"}
                            IconAfterHide={<GoPlus />}
                            onClick={showModalUser}
                          />
                        </div>
                      </div>
                      <div className="flex gap-0.5 items-center flex-wrap">
                        {userSelects.slice(0, 10).map((item, index) => (
                          <div
                            key={index}
                            className="h-10 w-10 rounded-md overflow-hidden relative"
                          >
                            <img
                              className="h-full w-full object-cover"
                              src={item.imgUrl || AvatarNotFound}
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
        <MyModal
          closeModal={hideModalUser}
          isOpen={openModalUser}
          height={"75%"}
          width={"75%"}
        >
          <div className="flex flex-col overflow-hidden h-full w-full">
            <div className="flex w-full items-center justify-center">
              <form action="" className="flex gap-3">
                <div className="bg-[#e7e7e7] xl:w-2xl lg:w-xl md:w-xs flex w-42 rounded-lg items-center">
                  <input
                    className="block flex-1 outline-0 text-sm pl-3 font-medium "
                    type="text"
                    name="keyword"
                    id=""
                    placeholder="Search here..."
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="p-2 bg-[#FF6767] inline-flex items-center gap-1 rounded-lg cursor-pointer"
                  >
                    <CiSearch className="text-white" size={20} />
                    <div className="sm:block hidden">
                      <p className="text-sm text-white">Search</p>
                    </div>
                  </button>
                </div>
              </form>
            </div>
            <div className="md:px-10 my-3 px-2 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2 w-full overflow-hidden">
                {users.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 border border-gray-300 p-3 rounded-md"
                  >
                    <input
                      type="checkbox"
                      value={item._id}
                      onChange={hanldeChangeCheckUser}
                      defaultChecked={userSelects.find(
                        (itemSelect) => itemSelect.value === String(item._id)
                      )}
                      data-img-url={item.avatar}
                    />
                    <img
                      className="w-[54px] h-[54px] object-cover rounded-xl"
                      src={item.avatar || AvatarNotFound}
                      alt=""
                    />
                    <div className="max-w-32 sm:max-w-full">
                      <p className="font-semibold max-w-full">
                        {item.fullname}
                      </p>
                      <p className="text-sm mt-0.5 text-gray-500 text-ellipsis line-clamp-1">
                        {item.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between px-3 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="check-all"
                  onChange={handleCheckAllUSer}
                  defaultChecked={userSelects.length === users.length}
                  ref={inputCheckRef}
                />
                <label htmlFor="check-all" className="">
                  Check All
                </label>
              </div>
              <Button title={"Done"} onClick={hideModalUser} />
            </div>
          </div>
        </MyModal>
      </div>
    </MyModal>
  );
};

export default ModalAddTask;
