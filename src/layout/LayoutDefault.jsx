import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { deleteCookie, getCookie } from "../utils/cookie";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/reducers/authReducer";
import { ToastContainer } from "react-toastify";
import { userDetail } from "../services/api/user";

const LayoutDefault = () => {
  const token = getCookie("token");

  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.auth);

  const fetchUserDetail = async (token) => {
    const response = await userDetail(token);
    if (!response || response.code !== 200) {
      deleteCookie("token");
      navigate("/auth/login");
    } else {
      const user = response.info;
      dispatch(
        addUser({
          _id: user._id,
          avatar: user.avatar,
          fullname: user.fullname,
          email: user.email,
        })
      );
      console.log("user");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetail(token);
    }
  }, [token, location.pathname]);

  if (!token) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    user && (
      <main className="w-full flex h-screen bg-[#F5F8FF]">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          stacked
        />
        <Header />
        <div className="flex pt-34 w-full relative justify-center overflow-hidden">
          <Sider />
          <div className="flex-1 md:px-16">
            <Outlet />
          </div>
        </div>
      </main>
    )
  );
};

export default LayoutDefault;
