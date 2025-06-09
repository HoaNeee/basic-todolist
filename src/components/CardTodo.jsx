import React from "react";
import { NavLink } from "react-router";
import { formatDate, relativeTime } from "../helpers/formatDate";

const CardTodo = ({
  footerSmaller,
  smaller,
  id,
  title,
  desc,
  active,
  imageUrl,
  onClick,
  Link,
  toLink,
  status,
  statusHex,
  priority,
  priorityHex,
  createdAt,
  footerCol,
  completedAt,
}) => {
  return Link ? (
    <>
      <NavLink
        to={toLink}
        className={(activeNav) => {
          return `flex border-[1.5px] border-[#A1A3AB] rounded-xl py-3 px-4 gap-1 ${
            activeNav.isActive
              ? "bg-[#E7EAF1]"
              : "hover:bg-[#E7EAF1] transition-all"
          }`;
        }}
        data-id={id}
      >
        <div
          className="sm:block hidden text-xs md:w-3 md:h-3 w-2 h-2 md:border-3 border-2 rounded-full"
          style={{ borderColor: `#${statusHex}` }}
        ></div>
        <div className="w-full">
          <div className="flex justify-between px-2">
            <div className={`${imageUrl ? "max-w-4/6" : ""}`}>
              <p
                className={`font-semibold ${
                  smaller ? "lg:text-[16px] md:text-sm" : ""
                }`}
              >
                {title || "This is the Title"}
              </p>
              <div>
                <p
                  className={`md:text-sm text-xs text-[#747474] text-ellipsis ${
                    smaller ? "line-clamp-2 my-3" : "line-clamp-3 min-h-16"
                  }`}
                >
                  {desc || "This is the description"}
                </p>
              </div>
              {footerCol && (
                <div className="flex flex-col justify-between mt-2 gap-2">
                  <p className="text-xs flex gap-1">
                    Status:
                    <span className="text-[#05A301]"> Completd</span>
                  </p>
                  <span className="text-xs flex text-[#A1A3AB]">
                    Completed {relativeTime(completedAt)}
                  </span>
                </div>
              )}
            </div>
            {imageUrl && (
              <div
                className={`h-full flex md:justify-end justify-center overflow-hidden`}
              >
                <img
                  className="h-[88px] w-[88px] rounded-xl object-cover"
                  src={imageUrl}
                  alt=""
                />
              </div>
            )}
          </div>
          {!footerCol && (
            <div
              className={`sm:flex grid grid-cols-2 sm:justify-between ${
                footerSmaller ? "mt-3" : "mt-5"
              }`}
            >
              {!status ||
                (status !== "Completed" && (
                  <p
                    className={`${
                      footerSmaller
                        ? "text-[10px] sm:text-xs xl:text-[10px]"
                        : "text-xs"
                    } flex gap-1`}
                  >
                    Priority:{" "}
                    <span
                      className=""
                      style={{ color: `#${priorityHex || "bababa"}` }}
                    >
                      {" "}
                      {priority || "not data"}
                    </span>
                  </p>
                ))}
              <p
                className={`${
                  footerSmaller
                    ? "text-[10px] sm:text-xss xl:text-[10px]"
                    : "text-xs"
                } flex gap-1`}
              >
                Status:{" "}
                <span
                  className=""
                  style={{
                    color: `#${statusHex || "bababa"}`,
                  }}
                >
                  {" "}
                  {status || "not data"}
                </span>
              </p>
              <span
                className={`${
                  footerSmaller
                    ? "text-[10px] sm:text-xs xl:text-[10px]"
                    : "text-xs"
                } flex gap-1 text-[#A1A3AB]`}
              >
                {!status || status !== "Completed"
                  ? `Created on: ${formatDate(createdAt)}`
                  : `Completed ${relativeTime(completedAt)}`}
              </span>
            </div>
          )}
        </div>
      </NavLink>
    </>
  ) : (
    <>
      {/* not use */}
      <div
        className={`flex border-[1.5px] border-[#A1A3AB] rounded-xl py-3 px-4 gap-1 ${
          active ? "bg-[#E7EAF1]" : ""
        } ${onClick && "cursor-pointer"}`}
        onClick={() => onClick()}
      >
        <div className="sm:block hidden text-xs md:w-3 md:h-3 w-2 h-2 md:border-3 border-2 rounded-full border-[#FF6767]"></div>
        <div className="w-full">
          <div className="flex justify-between px-2">
            <div className={`${imageUrl ? "max-w-4/6" : ""}`}>
              <p
                className={`font-semibold ${
                  smaller ? "lg:text-[16px] md:text-sm" : ""
                }`}
              >
                {title || "This is the Title"}
              </p>
              <div>
                <p
                  className={`md:text-sm text-xs text-[#747474] text-ellipsis ${
                    smaller ? "line-clamp-2 my-3" : "line-clamp-3 min-h-16"
                  }`}
                >
                  {desc || "This is the description"}
                </p>
              </div>
            </div>
            {imageUrl && (
              <div
                className={`h-full flex md:justify-end justify-center overflow-hidden`}
              >
                <img
                  className="h-[88px] w-[88px] rounded-xl object-cover"
                  src={imageUrl}
                  alt=""
                />
              </div>
            )}
          </div>
          <div
            className={`sm:flex sm:justify-between grid grid-cols-2 ${
              footerSmaller ? "mt-2" : "mt-6"
            }`}
          >
            <p
              className={`${
                footerSmaller
                  ? "text-[10px] sm:text-xs xl:text-[10px]"
                  : "text-xs"
              } flex gap-1`}
            >
              Priority: <span className="text-[#42ADE2]"> Moderate</span>
            </p>
            <p
              className={`${
                footerSmaller
                  ? "text-[10px] sm:text-xss xl:text-[10px]"
                  : "text-xs"
              } flex gap-1`}
            >
              Status: <span className="text-[#FF6767]"> Not Started</span>
            </p>
            <span
              className={`${
                footerSmaller
                  ? "text-[10px] sm:text-xs xl:text-[10px]"
                  : "text-xs"
              } flex gap-1 text-[#A1A3AB]`}
            >
              Created on: 20/06/2023
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardTodo;
