import { get, patch } from "../../utils/requets";

export const userDetail = async (token) => {
  try {
    const response = await get("/users/detail", token);

    return response;
  } catch (error) {
    return error.messasge || error;
  }
};

export const updateUser = async (token, options) => {
  try {
    const response = await patch("/users/edit", options, token);
    return response;
  } catch (error) {
    return error;
  }
};

export const changePassword = async (token, options) => {
  try {
    const response = await patch("/users/change-password", options, token);
    return response;
  } catch (error) {
    return error;
  }
};
