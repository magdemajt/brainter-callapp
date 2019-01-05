import { axiosPost, axiosGet, axiosPut, axiosDelete, axiosPostFile } from './index'; // eslint-disable-line

export const getPermission = (success, failure) => {
  axiosGet('/api/admin', success, failure);
};
export const getUserStats = (date, success, failure) => {
  axiosGet(`/api/userstats/${date}`, success, failure);
};

export const getMessageStats = (date, success, failure) => {
  axiosGet(`/api/msgstats/${date}`, success, failure);
};

export const getMessageUserStats = (date, success, failure) => {
  axiosGet(`/api/msguserstats/${date}`, success, failure);
};

export const addTag = (name, aliases, success, failure) => {
  axiosPost('/api/tag', { name, aliases }, success, failure);
};
