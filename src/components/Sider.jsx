import { MdWindow } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { Link, NavLink } from "react-router";
import { FiPlus } from "react-icons/fi";
import { RxExit } from "react-icons/rx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageAvatarNotFound from "../assets/avatarNotFound.jpg";
import { deleteCookie } from "../utils/cookie";
import { IoColorPaletteOutline } from "react-icons/io5";
import { removeUser } from "../redux/reducers/authReducer";

const menu = [
  {
    title: "Dashboard",
    icon: <MdWindow />,
    href: "/",
  },
  {
    title: "Add Task",
    icon: <FiPlus />,
    href: "/add-task",
  },
  {
    title: "My Task",
    icon: <BiTask />,
    href: "/my-task",
  },
  {
    title: "Task Categories",
    icon: <GoTasklist />,
    href: "/task-category",
  },
  {
    title: "Color",
    icon: <IoColorPaletteOutline />,
    href: "/color",
  },
  {
    title: "Settings",
    icon: <IoMdSettings />,
    href: "/setting",
  },
];

const Sider = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowMenuMain = () => {
    setShowMenu(!showMenu);
  };

  const user = useSelector((state) => state.auth.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeUser(null));
    deleteCookie("token");
  };

  return (
    <div className="h-auto flex">
      <div
        className={`lg:w-[20rem] md:w-[13rem] absolute -left-full md:relative md:left-auto w-2/3 md:flex flex-col justify-between h-full md:h-auto bg-[#FF6767] rounded-tr-lg z-31 transition-all ${
          showMenu ? "left-0" : ""
        }`}
      >
        <div className="">
          <div className="flex flex-col items-center text-center -mt-10">
            <Link
              to={"/my-info"}
              className="w-[86px] h-[86px] overflow-hidden rounded-full border-2 border-white"
              onClick={() => setShowMenu(false)}
            >
              <img
                className="h-full w-full object-cover"
                src={user.avatar || ImageAvatarNotFound}
                alt="this is image"
              />
            </Link>
            <div>
              <Link
                to={"/my-info"}
                className="text-white font-semibold hover:text-gray-100"
                onClick={() => setShowMenu(false)}
              >
                {user.fullname || "User name"}
              </Link>
              <p className="text-xs text-white">
                {user.email || "Example@gmail.com"}
              </p>
            </div>
          </div>

          {/* main menu */}
          <div className="mt-4 px-4 flex flex-col gap-2">
            {menu.map((item, index) => (
              <NavLink
                to={item.href}
                key={index}
                className={(active) => {
                  return `gap-2 items-center py-3 px-5 rounded-xl ${
                    active.isActive
                      ? "bg-white text-[#FF6767]"
                      : "text-white hover:bg-white hover:text-[#FF6767]"
                  } flex transition-all`;
                }}
                onClick={() => setShowMenu(false)}
              >
                <div className={`text-lg md:text-2xl lg:text-3xl`}>
                  {item.icon}
                </div>
                <p className={`font-normal md:font-medium `}>{item.title}</p>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="px-4 md:mt-0 mt-10">
          <NavLink
            to={"/auth/login"}
            className={`gap-2 items-center py-3 px-5 rounded-xl flex`}
            onClick={handleLogout}
          >
            <div className={`text-lg md:text-2xl lg:text-3xl text-white`}>
              <RxExit />
            </div>
            <p className={`font-normal md:font-medium text-white`}>Logout</p>
          </NavLink>
        </div>
      </div>
      <div
        className={`block md:hidden absolute top-22 right-4 cursor-pointer`}
        onClick={handleShowMenuMain}
      >
        <div className="w-[45px] h-[45px] overflow-hidden rounded-full border-2 border-white">
          <img
            className="h-full w-full object-cover"
            src={user?.avatar || ImageAvatarNotFound}
            alt=""
          />
        </div>
      </div>
      {showMenu && (
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-black opacity-40 z-30 block md:hidden"
          onClick={handleShowMenuMain}
        ></div>
      )}
    </div>
  );
};

export default Sider;
