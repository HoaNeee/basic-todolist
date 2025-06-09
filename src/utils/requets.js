export const BASE_URL = `https://basic-be-todolist.onrender.com`;
const API_URL = `${BASE_URL}/api/v1`;

export const get = async (path, token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(API_URL + path, {
      headers: myHeaders,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const post = async (path, options, token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(options),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return new Error(error.message || error);
  }
};

export const patch = async function (path, options, token) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(options),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const del = async function (path, id, token) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(`${API_URL}${path}/${id}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const postImage = async (path, key, options, token) => {
  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "multipart/form-data");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  const formdata = new FormData();
  formdata.append(key, options);
  try {
    const response = await fetch(`${API_URL}/upload/${path}`, {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
