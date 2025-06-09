import React from "react";
import { Navigate, Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { optionsToast } from "../helpers/optionsToast";
import { getCookie } from "../utils/cookie";

const LayoutAuth = () => {
  const token = getCookie("token");

  if (token) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-[url(/src/assets/bg-auth.png)] bg-[#FF6767] flex items-center justify-center max-h-screen">
      <ToastContainer {...optionsToast} />
      <Outlet />
    </div>
  );
};

export default LayoutAuth;
