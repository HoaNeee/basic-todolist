import React from "react";
import "../css/input.css";

const Input = ({
  name,
  placeholder,
  type,
  Icon,
  label,
  onChange,
  require,
  id,
  typeInput,
  defaultValue,
  readonly,
  colorTitle,
  ref,
}) => {
  return type === "checkbox" ? (
    <div className="checkbox-wrapper-29 mt-4">
      <label className="checkbox">
        <input
          type={"checkbox"}
          className="checkbox__input"
          name={name}
          onChange={onChange ? onChange : undefined}
        />
        <span className="checkbox__label text-sm font-medium"></span>
        {label}
      </label>
    </div>
  ) : type === "normal" ? (
    <div className="flex flex-col gap-1">
      <label htmlFor={id || ""} className="font-semibold text-sm">
        {label}
      </label>
      <input
        ref={ref || undefined}
        type={typeInput || "text"}
        name={name}
        id={id || ""}
        className={`border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3 ${
          readonly ? "bg-gray-100" : ""
        }`}
        defaultValue={defaultValue ? defaultValue : ""}
        readOnly={readonly ? readonly : false}
        onChange={onChange ? onChange : undefined}
        required={require ? require : false}
        style={{ color: colorTitle ? `#${colorTitle}` : "" }}
      />
    </div>
  ) : (
    // auth
    <div
      className={`w-full border-[1.5px] rounded-lg border-gray-500 flex ${
        Icon ? "flex-row items-center" : "flex-col"
      } md:h-13 h-12 pl-4 gap-5 overflow-hidden`}
    >
      {Icon ? Icon : <></>}

      <input
        id={id}
        type={typeInput || "text"}
        name={name}
        className="outline-0 w-full h-full pl-2"
        placeholder={placeholder ? placeholder : ""}
        onChange={onChange ? onChange : undefined}
        required={require}
      />
    </div>
  );
};

export default Input;
