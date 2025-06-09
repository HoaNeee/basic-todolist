import React from "react";

const ButtonIcon = ({ Icon, onClick }) => {
  return (
    <button
      className="p-2 bg-[#FF6767] inline-block rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="text-white text-lg">{Icon}</div>
    </button>
  );
};

export default ButtonIcon;
