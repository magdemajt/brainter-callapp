import cookie from 'cookies-js';

export const setLoginCookies = (token) => {
  cookie.set('token', token, {
    expires: 5356800
  });
};
export const clearLoginCookies = () => {
  cookie.expire('token');
};
