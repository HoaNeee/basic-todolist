import React, { useState } from "react";
import HeadContent from "../components/HeadContent";
import GoBack from "../components/GoBack";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import ImageAvatarNotFound from "../assets/avatarNotFound.jpg";
import { editUser } from "../redux/reducers/authReducer";
import { getCookie } from "../utils/cookie";
import { toast } from "react-toastify";
import { changePassword, updateUser } from "../services/api/user";
import { postImage } from "../utils/requets";
import Loading from "../components/Loading";

const InfoUser = () => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [loading, setLoading] = useState();

  const user = useSelector((state) => state.auth.auth);
  const dispatch = useDispatch();

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    const data = {};
    const form = e.target.elements;
    for (let i = 0; i < form.length - 2; i++) {
      const name = form[i].name;
      const value = form[i].value;
      data[name] = value;
    }
    const token = getCookie("token");
    if (token) {
      try {
        setLoading(true);
        const response = await updateUser(token, data);
        if (!response || response.code !== 200) {
          throw new Error(response.messgae || "ERROR");
        }
        toast.success(response.message);
        dispatch(
          editUser({
            ...user,
            ...data,
          })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message || error);
      }
    }
  };

  const hanldeChangeImage = async (e) => {
    const token = getCookie("token");

    if (token) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const responseImage = await postImage("user", "avatar", file, token);
        if (!responseImage || responseImage.code !== 200) {
          throw new Error(responseImage.message || "ERROR");
        }
        const url = responseImage.imageUrl;
        const response = await updateUser(token, {
          ...user,
          avatar: url,
        });
        if (!response || response.code !== 200) {
          throw new Error(responseImage.message || "ERROR");
        }
        toast.success(response.message);
        dispatch(
          editUser({
            ...user,
            avatar: url,
          })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message || error);
      }
    }
  };

  const handleDeleteImage = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        setLoading(true);
        const response = await updateUser(token, {
          avatar: "",
        });
        if (!response || response.code !== 200) {
          throw new Error(response.messgae || "ERROR");
        }
        toast.success(response.message);
        dispatch(
          editUser({
            ...user,
            avatar: "",
          })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message || error);
      }
    }
  };

  const handleSubmitChangePass = async (e) => {
    e.preventDefault();
    const data = {};
    const form = e.target.elements;
    for (let i = 0; i < form.length - 2; i++) {
      const name = form[i].name;
      const value = form[i].value;
      data[name] = value;
    }
    const token = getCookie("token");
    if (token) {
      if (data["new-password"] !== data["confirm-password"]) {
        toast.error("Confirm Password not match with Password");
      } else {
        try {
          setLoading(true);
          const response = await changePassword(token, data);
          if (!response || response.code !== 200) {
            throw new Error(response.message || "ERROR");
          }
          toast.success(response.message);
          setShowChangePass(false);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          toast.error(error.message || error);
        }
      }
    }
  };

  const handleShowChangePass = () => {
    setShowChangePass(true);
  };
  const handleHideChangePass = () => {
    setShowChangePass(false);
  };

  return (
    user && (
      <>
        <div className="pb-4 w-full h-full">
          <div className="w-full h-full border-[1.5px] border-[#dadada] rounded-xl p-4 shadow-lg flex flex-col">
            <HeadContent title={"Account Infomation"} Left={<GoBack />} />
            <div className="flex gap-4 items-center mt-5 px-4">
              <div className="w-24 h-24 rounded-full relative overflow-hidden">
                <img
                  src={user?.avatar || ImageAvatarNotFound}
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="h-full w-full absolute rounded-full top-0 left-0 hover:bg-black/40 transition-all group">
                  <div className="h-full w-full text-white text-sm group-hover:flex flex-col justify-around items-center hidden font-medium">
                    <label
                      className="cursor-pointer hover:text-yellow-300"
                      htmlFor="avatar"
                    >
                      Change
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      className="hidden"
                      onChange={hanldeChangeImage}
                    />
                    {user && user.avatar && (
                      <span
                        className="cursor-pointer hover:text-red-400"
                        onClick={handleDeleteImage}
                      >
                        Delete
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {user.fullname || "Username"}
                </p>
                <p className="">{user.email || "example@gmail.com"}</p>
              </div>
            </div>
            <div className="px-3 mt-6 h-full overflow-hidden">
              <div className="h-full border p-3 border-gray-300 rounded-md relative">
                {!showChangePass && (
                  <form
                    action=""
                    className="md:max-w-2/3 max-w-full h-full"
                    onSubmit={handleSubmitInfo}
                  >
                    <div className="h-full w-full flex flex-col gap-2 justify-between">
                      <div className="flex flex-col gap-3">
                        <Input
                          type={"normal"}
                          label={"Fullname"}
                          name={"fullname"}
                          id={"fullname"}
                          defaultValue={user.fullname || ""}
                        />
                        <Input
                          type={"normal"}
                          label={"Email"}
                          typeInput={"email"}
                          id={"email"}
                          defaultValue={user.email || ""}
                          name={"email"}
                        />
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <Button title={"Update Info"} typeBtn={"submit"} />
                        <Button
                          title={"Change Password"}
                          onClick={handleShowChangePass}
                        />
                      </div>
                    </div>
                  </form>
                )}
                {showChangePass && (
                  <div
                    className={`w-full h-full absolute left-0 top-0 rounded-md p-3 transition-all duration-200`}
                  >
                    <form
                      action=""
                      className="md:max-w-2/3 max-w-full h-full"
                      onSubmit={handleSubmitChangePass}
                    >
                      <div className="h-full w-full flex flex-col gap-2 justify-between">
                        <div className="flex flex-col gap-3">
                          <Input
                            type={"normal"}
                            label={"Current Password"}
                            name={"current-password"}
                            id={"current-password"}
                            typeInput={"password"}
                            require
                          />
                          <Input
                            type={"normal"}
                            label={"New Password"}
                            typeInput={"password"}
                            id={"new-password"}
                            name={"new-password"}
                            require
                          />
                          <Input
                            type={"normal"}
                            label={"Confirm Password"}
                            typeInput={"password"}
                            id={"confirm-password"}
                            name={"confirm-password"}
                            require
                          />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <Button
                            title={"Update Passowrd"}
                            typeBtn={"submit"}
                          />
                          <Button
                            title={"Cancel"}
                            onClick={handleHideChangePass}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {loading && <Loading typeLoading={"screen"} />}
      </>
    )
  );
};

export default InfoUser;
