import React, { useEffect, useState } from "react";
import HeadContent from "../components/HeadContent";
import Button from "../components/Button";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import GoBack from "../components/GoBack";
import { getCookie } from "../utils/cookie";
import { del, get, patch, post } from "../utils/requets";
import ModalAdd from "../components/modal/ModalAdd";
import { toast, Zoom } from "react-toastify";
import ModalUpdate from "../components/modal/ModalUpdate";
import TooltipDelete from "../components/TooltipDelete";
import TableCategory from "../components/table/TableCategory";
import Loading from "../components/Loading";

const TaskCategory = () => {
  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);

  const [showModalStatusAdd, setshowModalStatusAdd] = useState(false);
  const [showModalStatusEdit, setShowModalStatusEdit] = useState(false);
  const [statusSelect, setStatusSelect] = useState(null);
  const [openTooltipStatus, setOpenTooltipStatus] = useState(false);

  const [showModalPriorityAdd, setshowModalPriorityAdd] = useState(false);
  const [showModalPriorityEdit, setShowModalPriorityEdit] = useState(false);
  const [prioriySelect, setPrioritySelect] = useState(null);
  const [openTooltipPriority, setOpenTooltipPriority] = useState(false);

  const [colors, setColors] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countPress, setCountPress] = useState(0);

  useEffect(() => {
    const token = getCookie("token");
    const fetchStatus = async (token) => {
      const result = await get("/status", token);
      if (!result || result.code !== 200) {
        //error
        throw new Error(result.message || "Error");
      }
      return result.data;
    };
    const fetchPriority = async (token) => {
      const result = await get("/priority", token);
      if (!result || result.code !== 200) {
        //error
        throw new Error(result.message || "Error");
      }
      return result.data;
    };
    const fetchColor = async (token) => {
      const result = await get("/colors", token);
      if (!result || result.code !== 200) {
        throw new Error(result.message || "Error");
      }
      return result.data;
    };

    const fetchData = async (token) => {
      setLoading(true);
      return Promise.all([
        fetchStatus(token),
        fetchPriority(token),
        fetchColor(token),
      ]);
    };

    if (token) {
      fetchData(token)
        .then((data) => {
          const [status, priority, colors] = data;
          setStatus(status);
          setColors(colors);
          setPriority(priority);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message || error);
        });
    }
  }, []);

  const showStatusAdd = () => {
    setshowModalStatusAdd(true);
  };
  const hideStatusAdd = () => {
    setshowModalStatusAdd(false);
  };
  const showStatusEdit = (status) => {
    setStatusSelect(status);
    setShowModalStatusEdit(true);
  };
  const hideStatusEdit = () => {
    setShowModalStatusEdit(false);
  };
  const hideTooltipStatus = () => {
    setOpenTooltipStatus(false);
  };
  const showTooltipStatus = (status) => {
    setStatusSelect(status);
    setOpenTooltipStatus(true);
  };

  const showPriorityAdd = () => {
    setshowModalPriorityAdd(true);
  };
  const hidePriorityAdd = () => {
    setshowModalPriorityAdd(false);
  };
  const showPriorityEdit = (priority) => {
    setPrioritySelect(priority);
    setShowModalPriorityEdit(true);
  };
  const hidePriorityEdit = () => {
    setShowModalPriorityEdit(false);
  };
  const hideTooltipPriority = () => {
    setOpenTooltipPriority(false);
  };
  const showTooltipPriority = (priority) => {
    setPrioritySelect(priority);
    setOpenTooltipPriority(true);
  };

  const handleSubmitCreateStatus = async (type, e) => {
    e.preventDefault();
    const formData = e.target.elements;

    const data = {};
    for (let i = 0; i < formData.length - 2; i++) {
      const name = formData[i].name;
      const value = formData[i].value;
      data[name] = value;
    }
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        if (type === 1) {
          //create
          const response = await post("/status/create", data, token);
          if (!response || response.code !== 200) {
            throw new Error(response.message || "Error");
          }
          hideStatusAdd();
          toast.success(response.message);

          const color_id = data.color_id || "";
          const color = colors.find((item) => item._id === color_id);
          if (color) {
            data.hex = color.hex;
          }
          setStatus((prev) => {
            const arr = [...prev];

            arr.push({
              ...response.data,
              hex: data.hex || "",
            });
            return arr;
          });
          setLoadingScreen(false);
        } else {
          //edit
          //some thing...
          const response = await patch(
            `/status/edit/${statusSelect._id || ""}`,
            data,
            token
          );
          if (!response || response.code !== 200) {
            throw new Error(response.message || "Error");
          }

          toast.success(response.message);
          const color_id = data.color_id || "";
          const color = colors.find((item) => item._id === color_id);
          if (color) {
            data.hex = color.hex;
          }

          setStatus((prev) => {
            let arr = [...prev];
            const idx = arr.findIndex(
              (item) => item._id === (String(statusSelect._id) || "")
            );
            if (idx !== -1) {
              arr[idx] = {
                ...arr[idx],
                hex: data.hex,
                title: data.title,
                key: data.key,
                color_id: data.color_id,
              };
            }
            return arr;
          });
          hideStatusEdit();
          setLoadingScreen(false);
        }
      } catch (error) {
        setLoadingScreen(false);
        toast.error(error.message || error);
      }
    }
  };
  const handleDeleteStatus = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        const response = await del(
          "/status/delete",
          String(statusSelect._id),
          token
        );
        if (!response || response.code !== 200) {
          throw new Error(response.message || "Error");
        }
        toast.success(response.message, {
          closeButton: false,
          theme: "light",
          pauseOnHover: false,
          hideProgressBar: true,
          transition: Zoom,
        });
        hideTooltipStatus();
        setStatus((prev) => {
          prev = prev.filter(
            (item) => String(item._id) !== String(statusSelect._id)
          );
          return prev;
        });
        setLoadingScreen(false);
      } catch (error) {
        setLoadingScreen(false);
        toast.error(error.message || error);
      }
    }
  };

  //priority
  const handleSubmitCreatePriority = async (type, e) => {
    e.preventDefault();
    const formData = e.target.elements;

    const data = {};
    for (let i = 0; i < formData.length - 2; i++) {
      const name = formData[i].name;
      const value = formData[i].value;
      data[name] = value;
    }
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        if (type === 1) {
          //create
          const response = await post("/priority/create", data, token);
          if (!response || response.code !== 200) {
            throw new Error(response.message || "Error");
          }
          hidePriorityAdd();
          toast.success(response.message);

          const color_id = data.color_id || "";
          const color = colors.find((item) => item._id === color_id);
          if (color) {
            data.hex = color.hex;
          }
          setPriority((prev) => {
            const arr = [...prev];

            arr.push({
              ...response.data,
              hex: data.hex || "",
            });
            return arr;
          });
          setLoadingScreen(false);
        } else {
          //edit
          //some thing...
          const response = await patch(
            `/priority/edit/${prioriySelect._id || ""}`,
            data,
            token
          );
          if (!response || response.code !== 200) {
            throw new Error(response.message || "Error");
          }

          toast.success(response.message);
          const color_id = data.color_id || "";
          const color = colors.find((item) => item._id === color_id);
          if (color) {
            data.hex = color.hex;
          }
          setLoadingScreen(false);
          setPriority((prev) => {
            let arr = [...prev];
            const idx = arr.findIndex(
              (item) => item._id === (String(prioriySelect._id) || "")
            );
            if (idx !== -1) {
              arr[idx] = {
                ...arr[idx],
                hex: data.hex,
                title: data.title,
                key: data.key,
                color_id: data.color_id,
              };
            }
            return arr;
          });
          hidePriorityEdit();
        }
      } catch (error) {
        setLoadingScreen(false);
        toast.error(error.message || error);
      }
    }
  };
  const handleDeletePriority = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        const response = await del(
          "/priority/delete",
          String(prioriySelect._id),
          token
        );
        if (!response || response.code !== 200) {
          throw new Error(response.message || "Error");
        }
        toast.success(response.message, {
          closeButton: false,
          theme: "light",
          pauseOnHover: false,
          hideProgressBar: true,
          transition: Zoom,
        });
        hideTooltipPriority();
        setPriority((prev) => {
          prev = prev.filter(
            (item) => String(item._id) !== String(prioriySelect._id)
          );
          return prev;
        });
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
      <div className="h-full w-full pb-4">
        <div className="w-full h-full border border-gray-300 p-4 rounded-xl shadow overflow-y-auto scroll-none">
          <HeadContent
            title={"Task Categories"}
            larger={true}
            Left={<GoBack />}
          />
          <div className="mt-4">
            <Button
              shadow={true}
              title={"Add Category"}
              onClick={() => {
                if (countPress <= 1) {
                  toast.warning("Updating...");
                }
                setCountPress((prev) => prev + 1);
              }}
            />
          </div>
          <div className="w-full mt-8">
            <HeadContent
              title={"Task Status"}
              Left={
                <Button
                  type={"link"}
                  title={"Add new status"}
                  onClick={() => {
                    showStatusAdd();
                  }}
                />
              }
            />
          </div>
          {
            <TableCategory
              data={status}
              showModal={showStatusEdit}
              showTooltip={showTooltipStatus}
              title={"Task Status"}
              idTooltip={"my-tooltip-status"}
              loading={loading}
            />
          }

          <div className="w-full mt-8">
            <HeadContent
              title={"Task Priority"}
              Left={
                <Button
                  type={"link"}
                  title={"add new priority"}
                  onClick={showPriorityAdd}
                />
              }
            />
          </div>
          {
            <TableCategory
              data={priority}
              showModal={showPriorityEdit}
              showTooltip={showTooltipPriority}
              title={"Task Priority"}
              idTooltip={"my-tooltip-priority"}
              loading={loading}
            />
          }
        </div>
      </div>
      <ModalAdd
        closeModal={hideStatusAdd}
        showModal={showModalStatusAdd}
        headContent={"Add New Status"}
        typeModal={"category"}
        nameCategory={"Status"}
        onSubmit={(e) => handleSubmitCreateStatus(1, e)}
        loading={loadingScreen}
        dataForSelect={colors}
      />
      <ModalAdd
        closeModal={hidePriorityAdd}
        showModal={showModalPriorityAdd}
        headContent={"Add New Priority"}
        typeModal={"category"}
        nameCategory={"Priority"}
        onSubmit={(e) => handleSubmitCreatePriority(1, e)}
        loading={loadingScreen}
        dataForSelect={colors}
      />
      <ModalUpdate
        closeModal={hideStatusEdit}
        showModal={showModalStatusEdit}
        headContent={"Update Status"}
        typeModal={"category"}
        nameCategory={"Status"}
        onSubmit={(e) => handleSubmitCreateStatus(2, e)}
        loading={loadingScreen}
        dataForSelect={colors}
        defaultValueTitle={statusSelect ? statusSelect.title : ""}
        defaultKeyValue={statusSelect ? statusSelect.key : ""}
        defaultSelect={statusSelect ? statusSelect : null}
      />
      <ModalUpdate
        closeModal={hidePriorityEdit}
        showModal={showModalPriorityEdit}
        headContent={"Update Priority"}
        typeModal={"category"}
        nameCategory={"Priority"}
        onSubmit={(e) => handleSubmitCreatePriority(2, e)}
        loading={loadingScreen}
        dataForSelect={colors}
        defaultValueTitle={prioriySelect ? prioriySelect.title : ""}
        defaultKeyValue={prioriySelect ? prioriySelect.key : ""}
        defaultSelect={prioriySelect ? prioriySelect : null}
      />
      <TooltipDelete
        id={"my-tooltip-status"}
        onCancel={hideTooltipStatus}
        setOpenTooltip={setOpenTooltipStatus}
        openTooltip={openTooltipStatus}
        onOk={handleDeleteStatus}
      />
      <TooltipDelete
        id={"my-tooltip-priority"}
        onCancel={hideTooltipPriority}
        setOpenTooltip={setOpenTooltipPriority}
        openTooltip={openTooltipPriority}
        onOk={handleDeletePriority}
      />
    </>
  );
};

export default TaskCategory;
