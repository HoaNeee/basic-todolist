import React from "react";

const HeadContent = ({ title, color, width, larger, Left }) => {
  const colorStr = color ? color : "bg-[#F24E1E]";
  const widthStr = width ? width : "w-1/2";

  return (
    <div className="w-full flex justify-between items-center">
      <div className="inline-flex flex-col">
        <p
          className={`font-semibold inline ${larger ? "text-2xl" : "text-sm"}`}
        >
          {title}
        </p>
        <div
          className={`inline-block h-1 rounded-lg ${colorStr} ${widthStr}`}
        ></div>
      </div>
      {Left ? Left : <></>}
    </div>
  );
};

export default HeadContent;
