import { post } from "../../utils/requets";

export const login = async (email, password) => {
  try {
    const response = await post("/users/login", {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const register = async (data) => {
  try {
    const response = await post("/users/register", data);
    return response;
  } catch (error) {
    return error;
  }
};
