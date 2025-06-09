import React from "react";
import { useNavigate } from "react-router";

const GoBack = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1, { preventScrollReset: false });
  };
  return (
    <div
      className="text-sm font-semibold underline cursor-pointer"
      onClick={handleGoBack}
    >
      Go back
    </div>
  );
};

export default GoBack;
