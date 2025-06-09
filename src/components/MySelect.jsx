import React, { useEffect, useState } from "react";

const MySelect = ({
  data,
  name,
  id,
  type,
  setColorHexSelect,
  defaultSelect,
}) => {
  const [itemHexSelect, setItemHexSelect] = useState(
    data && data.length > 0 ? data[0].hex : ""
  );

  const handleChangeOptions = (e) => {
    const colorHex =
      e.target.selectedOptions[0].dataset.colorHex || data[0].hex;
    setItemHexSelect(colorHex);
  };
  useEffect(() => {
    if (setColorHexSelect) {
      setColorHexSelect(itemHexSelect);
    }
  }, [itemHexSelect]);

  useEffect(() => {
    if (type === "color" && defaultSelect) {
      const select = document.querySelector(`select[name="${name}"]`);

      if (select) {
        const optId = String(defaultSelect._id) || "";
        if (optId) {
          const opt = select.querySelector(
            `option[data-color-hex="${defaultSelect.hex}"]`
          );
          if (opt) {
            setItemHexSelect(opt.getAttribute("data-color-hex"));
          }
        }
      }
    }
  }, [defaultSelect]);

  return (
    <select
      className="border-2 border-gray-300 rounded-md py-2 md:py-0.5 px-2 md:text-sm w-full text-center bg-black/5 outline-0 overflow-y-auto"
      style={{
        color:
          type === "color" ? `#${itemHexSelect ? `${itemHexSelect}` : ``}` : "",
      }}
      name={name}
      id={id ? id : null}
      onChange={handleChangeOptions}
      defaultValue={
        defaultSelect ? (type === "color" ? defaultSelect.color_id : "") : ""
      }
    >
      {data.map((item) =>
        type === "color" ? (
          <option
            value={item._id}
            key={item._id}
            style={{
              color: type === "color" ? `#${item.hex ? item.hex : ""}` : "",
            }}
            data-color-hex={item.hex}
            // selected={index === 1}
          >
            {" "}
            {item.title}
          </option>
        ) : (
          <option value={item._id} key={item._id}>
            {item.title}
          </option>
        )
      )}
    </select>
  );
};

export default MySelect;
