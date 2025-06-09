import React, { useEffect, useState } from "react";
import HeadContent from "../components/HeadContent";
import GoBack from "../components/GoBack";
import Button from "../components/Button";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { getCookie } from "../utils/cookie";
import { del, get, patch, post } from "../utils/requets";
import { toast, Zoom } from "react-toastify";
import ModalAdd from "../components/modal/ModalAdd";
import ModalUpdate from "../components/modal/ModalUpdate";
import TooltipDelete from "../components/TooltipDelete";
import Loading from "../components/Loading";

const Color = () => {
  const [colors, setColors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [colorSelect, setColorSelect] = useState(null);
  const [openTooltip, setOpenTooltip] = useState(false);

  const [undoItem, setUndoItem] = useState(false);
  const [addNew, setAddNew] = useState(false);

  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loading, setloading] = useState();

  useEffect(() => {
    const token = getCookie("token");

    const fetchColor = async (token) => {
      try {
        setloading(true);
        const result = await get("/colors", token);
        if (!result || result.code !== 200) {
          //error...
          throw new Error(result.message || "ERROR");
        }
        setColors(result.data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
      }
    };
    if (token) {
      fetchColor(token);
    }
  }, []);

  useEffect(() => {
    if (undoItem) {
      const el = document.querySelector(
        `tr[data-color-id="${colorSelect._id}"]`
      );
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          inline: "end",
        });
      }
      setUndoItem(false);
    }

    // console.log(addNew, showModal);

    if (addNew && showModal) {
      //TEMP FIX THEN
      handleHideModal();

      //CHUA HIEU TAI SAO LAI CHAY HIDEMODAL SAU
      setTimeout(() => {
        const table = document.querySelector(
          'table[data-table-name="tb-color"]'
        );
        if (table) {
          const els = table.querySelectorAll("tr");
          if (els && els.length > 0) {
            els[els.length - 1].scrollIntoView({
              behavior: "smooth",
              inline: "end",
            });
          }
        }
        setAddNew(false);
      }, 0);
    }
  }, [colors]);

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleHideModal = () => {
    setShowModal(false);
  };
  const handleShowModalEdit = (color) => {
    setColorSelect(color);
    setShowModalEdit(true);
  };
  const handleHideModalEdit = () => {
    setShowModalEdit(false);
  };

  const handleShowTooltip = (color) => {
    setColorSelect(color);
    setOpenTooltip(!false);
  };
  const handleHideTooltip = () => {
    setOpenTooltip(false);
  };

  const handleSubmitCreate = async (type, e) => {
    const data = {};
    e.preventDefault();
    const formData = e.target.elements;
    for (let i = 0; i < formData.length - 2; i++) {
      const name = formData[i].name;
      let value = formData[i].value;
      if (name === "hex") {
        value = value.substr(1);
      }
      data[name] = value;
    }
    if (!data.title || !data.hex) {
      toast.error("Please fill in the missing fields");
    } else {
      const token = getCookie("token");
      if (token) {
        try {
          setLoadingScreen(true);
          if (type === 1) {
            const response = await post("/colors/create", data, token);
            if (!response || response.code !== 200) {
              throw new Error(response.message || "An error occurred");
            }
            toast.success(response.message);

            setAddNew(true);
            // data._id = "abc";
            setColorSelect(response.data);
            setColors((prev) => {
              let arr = [...prev];
              arr.push(response.data);
              return arr;
            });

            // console.log(data);
          } else {
            const response = await patch(
              `/colors/edit/${String(colorSelect._id)}`,
              data,
              token
            );
            if (!response || response.code !== 200) {
              throw new Error(response.message || "An error occurred");
            }
            toast.success(response.message);
            handleHideModalEdit();
            const idx = colors.findIndex(
              (item) => String(item._id) === String(colorSelect._id)
            );
            if (idx !== -1) {
              setColors((prev) => {
                const arr = [...prev];
                arr[idx].title = data.title;
                arr[idx].hex = `${data.hex}`;
                return arr;
              });
            }
          }

          setLoadingScreen(false);
        } catch (error) {
          toast.error(error.message || error);
          setLoadingScreen(false);
        }
      }
    }
  };

  const handleDeleteColor = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        const response = await del(
          "/colors/delete",
          String(colorSelect._id),
          token
        );
        if (!response || response.code !== 200) {
          throw new Error(response.message || "Error");
        }
        toast(toastUndo, {
          data: {
            title: "Successfully",
          },
          closeButton: false,
          theme: "light",
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
          transition: Zoom,
        });
        setColors((prev) => {
          prev = prev.filter(
            (item) => String(item._id) !== String(colorSelect._id)
          );
          return prev;
        });
        setLoadingScreen(false);
      } catch (error) {
        toast.error(error.message || error);
        setLoadingScreen(false);
      }
    }
    handleHideTooltip();
  };

  const toastUndo = ({ data }) => {
    return (
      <div className="w-full flex justify-between">
        <p className="font-bold">{data.title}</p>
        <button
          onClick={handleUndoItem}
          className="font-medium text-purple-600 cursor-pointer"
        >
          Undo
        </button>
      </div>
    );
  };

  const handleUndoItem = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        setLoadingScreen(true);
        const response = await get(`/colors/undo/${colorSelect._id}`, token);
        if (!response || response.code !== 200) {
          throw new Error(response.message || "Error");
        }
        setUndoItem(true);
        setColors((prev) => {
          let arr = [...prev];
          arr.push(colorSelect);
          return arr;
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
            title={"Color Manager"}
            larger={true}
            Left={<GoBack />}
          />
          <div className="mt-4">
            <Button
              shadow={true}
              title={"Add Color"}
              onClick={handleShowModal}
            />
          </div>
          <div className="w-full mt-8">
            <HeadContent title={"Color System"} />
          </div>
          {
            <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden shadow min-h-60">
              <table
                className="min-w-full divide-y divide-neutral-200"
                data-table-name="tb-color"
              >
                <thead>
                  <tr className="">
                    <th className="py-2 text-sm">SN</th>
                    <th className="text-sm py-2 border-l border-r border-gray-300 w-1/4 sm:w-auto">
                      Title
                    </th>
                    <th className="py-2 text-sm border-l border-r border-gray-300">
                      Preview
                    </th>
                    <th className="py-2 text-sm w-1/3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading &&
                    colors.map((color, index) => {
                      return (
                        <tr key={color._id} data-color-id={color._id}>
                          <td className="py-3 text-center text-sm">
                            {index + 1}
                          </td>
                          <td className="py-3 text-center text-sm border-l border-r border-gray-300">
                            {color.title}
                          </td>
                          <td className="py-3 text-center text-sm border-l border-r border-gray-300">
                            <div
                              className={`h-4 inline-block w-1/2`}
                              style={{
                                backgroundColor: `#${color.hex}`,
                              }}
                            ></div>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                              <div>
                                <Button
                                  title={"Edit"}
                                  Icon={<FaRegEdit size={13} />}
                                  smaller={true}
                                  onClick={() => handleShowModalEdit(color)}
                                />
                              </div>
                              <div
                                data-tooltip-id="my-tooltip-color"
                                data-tooltip-variant="dark"
                              >
                                <Button
                                  title={"Delete"}
                                  Icon={<MdDelete size={13} />}
                                  smaller
                                  onClick={() => {
                                    handleShowTooltip(color);
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {loading ? (
                <div className="w-full flex items-center justify-center min-h-40">
                  <Loading />
                </div>
              ) : (
                colors &&
                colors.length <= 0 && (
                  <div className="w-full flex items-center justify-center min-h-40">
                    <p className="text-[#bababa]">No data</p>
                  </div>
                )
              )}
            </div>
          }
        </div>
      </div>

      <ModalAdd
        closeModal={handleHideModal}
        showModal={showModal}
        typeModal={"color"}
        headContent={"Add Color"}
        loading={loadingScreen}
        onSubmit={(e) => handleSubmitCreate(1, e)}
        typeMehod={"create"}
      />
      <ModalUpdate
        closeModal={handleHideModalEdit}
        showModal={showModalEdit}
        typeModal={"color"}
        headContent={"Edit Color"}
        loading={loadingScreen}
        onSubmit={(e) => handleSubmitCreate(2, e)}
        defaultValueTitle={
          colorSelect ? (colorSelect.title ? colorSelect.title : "") : ""
        }
        defaultValueColor={
          colorSelect ? (colorSelect.hex ? colorSelect.hex : "") : ""
        }
      />

      <TooltipDelete
        id={`my-tooltip-color`}
        onCancel={handleHideTooltip}
        onOk={handleDeleteColor}
        openTooltip={openTooltip}
        setOpenTooltip={setOpenTooltip}
      />
    </>
  );
};

export default Color;
