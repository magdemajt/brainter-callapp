import { axiosPost, axiosGet } from './index';

export const login = (email, pass, success, failure) => {
  axiosPost('/api/login', { email, pass }, success, failure);
};

export const register = (userInputs, success, failure) => {
  axiosPost('/api/register', { name: userInputs.name, email: userInputs.email, pass: userInputs.pass }, success, failure);
};

export const checkIfEmailAvailable = (email, success, failure) => {
  axiosGet(`/api/available-email/${email}`, success, failure);
};
