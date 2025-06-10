import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import AvatarNotFound from "../../assets/avatarNotFound.jpg";
import MyModal from "./MyModal";
import Button from "../Button";

const ModalUser = ({
  isOpen,
  closeModal,
  users,
  userSelects,
  setUserSelects,
}) => {
  const [listUser, setListUser] = useState([]);

  const inputCheckRef = useRef();

  useEffect(() => {
    setListUser(users);
  }, [users]);

  useEffect(() => {
    if (inputCheckRef.current) {
      if (userSelects.length === listUser.length && listUser.length > 0) {
        inputCheckRef.current.checked = true;
      } else {
        inputCheckRef.current.checked = false;
      }
    }
  }, [userSelects]);

  let arrUserSelect = [...userSelects];

  const hanldeChangeCheckUser = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const imgUrl = e.target.dataset.imgUrl;
    if (checked) {
      arrUserSelect.push({
        id: value,
        avatar: imgUrl,
      });
    } else {
      arrUserSelect = arrUserSelect.filter((item) => item.id !== value);
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
          if (!arrUserSelect.find((item) => item.id === value)) {
            arrUserSelect.push({
              id: value,
              avatar: imgUrl,
            });
          }
        } else {
          arrUserSelect = arrUserSelect.filter((item) => item.id !== value);
        }
      }
    }
    setUserSelects(arrUserSelect);
  };

  const hanldeSearch = (e) => {
    const key = e.target.value;
    if (key) {
      listUser &&
        setListUser(
          listUser.filter((item) =>
            item.fullname.toLowerCase().includes(key.toLowerCase())
          )
        );
    } else {
      setListUser(users);
    }
  };

  return (
    <MyModal
      closeModal={closeModal}
      isOpen={isOpen}
      height={"75%"}
      width={"75%"}
    >
      <div className="flex flex-col overflow-hidden h-full w-full">
        <div className="flex w-full items-center justify-center">
          <form
            action=""
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="bg-[#e7e7e7] xl:w-2xl lg:w-xl md:w-xs flex w-42 rounded-lg items-center">
              <input
                className="block flex-1 outline-0 text-sm pl-3 font-medium "
                type="text"
                name="keyword"
                id=""
                placeholder="Search here..."
                onChange={hanldeSearch}
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
          {listUser && listUser.length > 0 ? (
            <div className="flex flex-col gap-2 w-full overflow-hidden">
              {listUser.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 border border-gray-300 p-3 rounded-md"
                >
                  <input
                    type="checkbox"
                    value={item._id}
                    onChange={hanldeChangeCheckUser}
                    defaultChecked={userSelects.find(
                      (itemSelect) => itemSelect.id === String(item._id)
                    )}
                    data-img-url={item.avatar || ""}
                  />
                  <div className="flex-1">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[#bababa]">
              <p>No data</p>
            </div>
          )}
        </div>
        <div className="flex justify-between px-3 items-center">
          {listUser && listUser.length > 0 ? (
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
          ) : (
            <div></div>
          )}
          <Button title={"Done"} onClick={closeModal} />
        </div>
      </div>
    </MyModal>
  );
};

export default ModalUser;
