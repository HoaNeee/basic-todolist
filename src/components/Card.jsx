import React from "react";
import ImageNotFound from "../assets/notfound.png";

const CardShort = ({ title, desc, imageUrl, completedAt }) => {
  return (
    <div className="flex border-[1.5px] border-[#A1A3AB] rounded-xl py-3 px-4 gap-2">
      <div className="text-xs md:w-3 md:h-3 w-2 h-2 md:border-3 border-2 rounded-full border-[#05A301]"></div>
      <div className="w-full">
        <div className="flex justify-between">
          <div className={`${imageUrl ? "max-w-3/5 md:max-w-3/5" : "w-full"}`}>
            <p className="font-semibold">{title || "This is the title card"}</p>
            <p className="md:text-sm text-xs text-[#747474] text-ellipsis line-clamp-3 min-h-16">
              {desc || "This is the content card"}
            </p>
            <div className="flex flex-col justify-between mt-2 gap-2">
              <p className="text-xs flex gap-1">
                Status:
                <span className="text-[#05A301]"> Completd</span>
              </p>
              <span className="text-xs flex text-[#A1A3AB]">
                Completed 2 days ago.
              </span>
            </div>
          </div>
          {imageUrl && (
            <div className="flex md:justify-end justify-center overflow-hidden items-center">
              <img
                className="h-[88px] w-[88px] rounded-xl object-cover"
                src={imageUrl || ImageNotFound}
                alt=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardShort;
