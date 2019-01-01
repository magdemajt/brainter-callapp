import { axiosPost } from '../../../components/axiosWrapper/axiosWrapper';

export const login = (email, pass, success, failure) => {
  axiosPost('/api/login', {email, pass}, success, failure);
};

export const register = (userInputs, success, failure) => {
  axiosPost('/api/register', {name: userInputs.name, email: userInputs.email, pass: userInputs.pass}, success, failure);
};

export const checkIfEmailAvailable = (email, success, failure) => {
  axiosPost('/api/available-email', {email}, success, failure);
};
