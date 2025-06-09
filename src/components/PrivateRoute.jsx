import React from "react";
import { Outlet } from "react-router";

const PrivateRoute = () => {
  console.log("first");
  return <Outlet />;
};

export default PrivateRoute;
