import React from "react";
import Button from "../Button";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Loading from "../Loading";

const TableCategory = ({
  title,
  data,
  showModal,
  showTooltip,
  idTooltip,
  loading,
}) => {
  return (
    <>
      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden shadow min-h-46">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr className="">
              <th className="py-2 text-sm">SN</th>
              <th className="text-sm py-2 border-l border-r border-gray-300">
                {title || ""}
              </th>
              <th className="py-2 text-sm w-1/3">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              data &&
              data.map((item, index) => (
                <tr key={item._id}>
                  <td className="py-3 text-center text-sm">{index + 1}</td>
                  <td
                    className="py-3 text-center text-sm border-l border-r border-gray-300"
                    style={{
                      color: `#${item.hex}`,
                    }}
                  >
                    {item.title}
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                      <div>
                        <Button
                          title={"Edit"}
                          Icon={<FaRegEdit size={13} />}
                          smaller={true}
                          onClick={() => showModal(item)}
                        />
                      </div>
                      <div data-tooltip-id={idTooltip}>
                        <Button
                          title={"Delete"}
                          Icon={<MdDelete size={13} />}
                          smaller
                          onClick={() => showTooltip(item)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading ? (
          <div className="w-full flex items-center justify-center min-h-40">
            <Loading />
          </div>
        ) : (
          data &&
          data.length <= 0 && (
            <div className="w-full flex items-center justify-center min-h-40">
              <p className="text-[#bababa]">No data</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default TableCategory;
