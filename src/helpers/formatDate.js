import moment from "moment";

export const formatDate = (date) => {
  const newDate = date || new Date();
  const ans = moment(newDate).format("DD/MM/YYYY");
  return ans;
};

export const dayOfWeek = (date) => {
  const newDate = date || new Date();
  return moment(newDate).format("dddd");
};

export const relativeTime = (date) => {
  const newDate = date || new Date();
  return moment(newDate).fromNow();
};

export const toTime = (date) => {
  const newDate = date || new Date();
  return moment(newDate).fromNow();
};
