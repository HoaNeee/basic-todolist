import React from "react";
import { Tooltip } from "react-tooltip";

const TooltipDelete = ({
  openTooltip,
  setOpenTooltip,
  id,
  onOk,
  onCancel,
  theme,
}) => {
  return (
    <Tooltip
      id={id || ""}
      clickable
      style={{
        borderRadius: "5px",
      }}
      openEvents={{
        click: true,
      }}
      closeEvents={{
        click: true,
      }}
      globalCloseEvents={{
        clickOutsideAnchor: true,
        scroll: true,
      }}
      isOpen={openTooltip}
      setIsOpen={setOpenTooltip}
      variant={theme || "dark"}
    >
      <div className="flex flex-col gap-1 text-sm">
        <p>Are you sure?</p>
        <div className="flex gap-3 justify-center py-2">
          <button
            className="rounded-md py-0.5 px-2 bg-red-600 cursor-pointer text-white"
            onClick={onOk}
          >
            YES
          </button>
          <button
            onClick={onCancel}
            className="rounded-md py-0.5 px-2 bg-gray-400 cursor-pointer"
          >
            NO
          </button>
        </div>
      </div>
    </Tooltip>
  );
};

export default TooltipDelete;
