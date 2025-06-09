import React from "react";

const Loading = ({ typeLoading }) => {
  return typeLoading === "screen" ? (
    <div className="w-screen absolute top-0 left-0 z-9999 bg-black/40 flex h-screen items-center justify-center">
      <div className="loader-screen" />
    </div>
  ) : (
    <div className="w-full flex h-full items-center justify-center">
      <div className="loader" />
    </div>
  );
};

export default Loading;
