import React from "react";
import { GoPlus } from "react-icons/go";

const Button = ({
  title,
  shadow,
  Icon,
  smaller,
  typeBtn,
  onClick,
  disabled,
  type,
  IconAfterHide,
}) => {
  return type === "link" ? (
    <button
      className="flex items-center gap-1 cursor-pointer outline-0"
      onClick={onClick}
    >
      <GoPlus className="text-[#FF6767] text-xl" />
      <p className="text-xs text-[#A1A3AB] capitalize">{title}</p>
    </button>
  ) : (
    <button
      disabled={disabled ? disabled : false}
      type={typeBtn || "button"}
      className={`${
        disabled ? "bg-[#bababa]" : "bg-[#F24E1E] "
      } text-sm text-white cursor-pointer ${
        smaller ? "px-2 py-1" : "py-1.5 px-5"
      } rounded-md outline-0 ${
        Icon || IconAfterHide
          ? "inline-flex items-center gap-1"
          : "inline-block"
      } ${shadow ? "shadow-md" : ""}`}
      onClick={onClick ? onClick : null}
    >
      {Icon && (
        <div className={`inline-block ${smaller ? "text-xs" : ""}`}>
          {Icon ? Icon : <></>}
        </div>
      )}
      {smaller && IconAfterHide && (
        <div className={`sm:hidden inline-flex`}>
          {IconAfterHide ? IconAfterHide : null}
        </div>
      )}
      <div
        className={`cursor-pointer ${
          smaller ? "text-xs sm:inline-block hidden" : "inline-block capitalize"
        }`}
      >
        <p>{title}</p>
      </div>
    </button>
  );
};

export default Button;
