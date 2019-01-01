import { axiosPost, axiosGet, axiosPut, axiosDelete, axiosPostFile } from './index'; // eslint-disable-line

export const getAuth = (success, failure) => {
  axiosGet('/api/auth', success, failure);
};

export const updateAuth = (userInputs, success, failure) => {
  axiosPut('/api/auth', { desc: userInputs.desc, photo: userInputs.photo }, success, failure);
};

export const updatePhoto = (photo, success, failure) => {
  axiosPostFile('/api/auth/photo', photo, success, failure);
};

export const updateEmail = (email, success, failure) => {
  axiosPut('/api/auth/email', { email }, success, failure);
};

export const updatePassword = (oldPass, pass, success, failure) => {
  axiosPut('/api/auth/pass', { oldPass, pass }, success, failure);
};

export const updateAuthWithTags = (userInputs, success, failure) => {
  axiosPut('/api/auth/tags', {
    tags: userInputs.tags,
    addTags: userInputs.addTags,
    removeTags: userInputs.removeTags,
    desc: userInputs.desc,
    photo: userInputs.photo
  }, success, failure);
};

export const addAuthTags = (tags, success, failure) => {
  axiosPost('/api/auth/tags', { tags }, success, failure);
};

export const getTags = (success, failure) => {
  axiosGet('/api/tags', success, failure);
};

export const deleteAuthTags = (tags, success, failure) => {
  axiosDelete('/api/auth/tags', { tags }, success, failure);
};

export const getUsers = (success, failure) => {
  axiosGet('/api/users', success, failure);
};

export const getUser = (id, success, failure) => {
  axiosGet(`/api/users/${id}`, success, failure);
};

export const getUsersByTags = (tags, success, failure) => {
  axiosPost('/api/users/tags', { tags }, success, failure);
};
