import { del, get, patch, post } from "../../utils/requets";

export const getAllTask = async (
  token,
  status,
  keyword,
  page = 1,
  limit = 10
) => {
  try {
    const response = await get(
      `/tasks?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}${
        keyword ? `&keyword=${keyword}` : ""
      }`,
      token
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getTaskDetail = async (token, id) => {
  try {
    const result = await get(`/tasks/detail/${id}`, token);
    return result;
  } catch (error) {
    return error;
  }
};

export const addTask = async (options, token) => {
  try {
    const response = await post("/tasks/create", options, token);
    if (!response || response.code !== 200) {
      throw new Error(response.message || "An error occurred");
    }
    return response;
  } catch (error) {
    return error.message || error;
  }
};

export const editTask = async (id, options, token) => {
  try {
    const response = await patch("/tasks/edit/" + id, options, token);
    if (!response || response.code !== 200) {
      throw new Error(response.message || "An error occurred");
    }
    return response;
  } catch (error) {
    return error.message || error;
  }
};

export const changeStatus = async (id, options, token) => {
  try {
    const response = await patch("/tasks/change-status/" + id, options, token);
    if (!response || response.code !== 200) {
      throw new Error(response.message || "An error occurred");
    }
    return response;
  } catch (error) {
    return error.message || error;
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await del("/tasks/delete", id, token);
    if (!response || response.code !== 200) {
      throw new Error(response.message || "An error occurred");
    }
    return response;
  } catch (error) {
    return error.message || error;
  }
};
