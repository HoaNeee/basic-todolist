import React, { useEffect, useRef, useState } from "react";
import MyModal from "./MyModal";
import HeadContent from "../HeadContent";
import { IoMdClose } from "react-icons/io";
import Input from "../Input";
import { HexColorPicker } from "react-colorful";
import Button from "../Button";
import MySelect from "../MySelect";

const ModalAdd = ({
  closeModal,
  showModal,
  onSubmit,
  loading,
  typeModal,
  headContent,
  nameCategory,
  dataForSelect,
}) => {
  const [color, setColor] = useState("#ffffff");
  const [keyValue, setKeyValue] = useState("");
  const [colorHexSelect, setColorHexSelect] = useState("");

  const inputColorRef = useRef();

  useEffect(() => {
    if (typeModal === "color" && inputColorRef.current) {
      inputColorRef.current.value = color;
    }
  }, [color]);

  const handleChangeKey = (e) => {
    let value = e.target.value;
    let ans = "";
    let cnt = 0;
    for (let c of value) {
      if (c === " ") {
        if (cnt <= 0) {
          ++cnt;
          ans += "-";
        }
      } else {
        cnt = 0;
        ans += c;
      }
    }
    if (ans[ans.length - 1] === "-") {
      ans = ans.slice(0, ans.length - 1);
    }
    setKeyValue(ans.toLowerCase());
  };

  useEffect(() => {
    if (!showModal && typeModal !== "color") {
      setKeyValue("");
    }
  }, [showModal]);

  return (
    <MyModal isOpen={showModal} width={"80%"} closeModal={closeModal}>
      <div className="w-full flex flex-col gap-2 pb-3 lg:h-[532px] h-auto">
        <HeadContent
          title={headContent}
          Left={
            <IoMdClose
              size={25}
              onClick={closeModal}
              className="cursor-pointer"
            />
          }
        />
        <div className="w-full mt-5 h-full">
          <form
            action=""
            className="p-5 border-2 border-gray-300 h-full flex flex-col justify-between"
            onSubmit={onSubmit}
            name={`${typeModal}-${headContent
              .split(" ")
              .join("-")
              .toLowerCase()}`}
          >
            <div>
              {typeModal === "category" ? (
                <Input
                  id={"title"}
                  label={"Title"}
                  name={"title"}
                  require={true}
                  type={"normal"}
                  onChange={(e) => handleChangeKey(e)}
                  colorTitle={colorHexSelect || ""}
                />
              ) : (
                <Input
                  id={"title"}
                  label={"Title"}
                  name={"title"}
                  require={true}
                  type={"normal"}
                />
              )}
              {/* color-picker */}
              {typeModal === "color" && (
                <div className="flex flex-col md:flex-row mt-6 md:gap-3 gap-5">
                  <div className="flex flex-col gap-1 md:w-1/2">
                    <label htmlFor={"color"} className="font-semibold text-sm">
                      Color picker
                    </label>
                    <input
                      ref={inputColorRef}
                      type={"text"}
                      name={"hex"}
                      id="color"
                      defaultValue={color}
                      className="border-2 border-gray-300 py-2 rounded-xl outline-0 pl-3"
                    />
                  </div>
                  <div className="md:w-1/2 flex items-center justify-center">
                    <HexColorPicker
                      color={color}
                      onChange={setColor}
                      defaultValue={"#ffffff"}
                    />
                  </div>
                </div>
              )}

              {/* key for category */}
              {typeModal === "category" && (
                <div className="flex flex-col gap-2">
                  <div className="mt-3">
                    <Input
                      label={`Key For ${nameCategory || "Category"}`}
                      readonly={true}
                      type={"normal"}
                      defaultValue={keyValue}
                      name={"key"}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="color_id" className="text-sm font-semibold">
                      Color For {nameCategory}
                    </label>
                    <div className="md:w-1/3 w-full">
                      <MySelect
                        name={"color_id"}
                        data={dataForSelect || []}
                        type={"color"}
                        setColorHexSelect={setColorHexSelect}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-5 md:mt-3">
              <Button title={"Create"} typeBtn={"submit"} disabled={loading} />
              <Button title={"Cancel"} onClick={closeModal} />
            </div>
          </form>
        </div>
      </div>
    </MyModal>
  );
};
export default ModalAdd;
