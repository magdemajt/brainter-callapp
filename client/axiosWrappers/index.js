import axios from 'axios';
import FormData from 'form-data';
import cookie from 'cookies-js';

export const axiosGet = (url, success, failure) => {
  axios({
    method: 'get',
    url,
    headers: {
      Authorization: cookie.get('token')
    }
  })
    .then(success)
    .catch((err) => {
      if (err) {
        failure(err);
      }
    });
};

export const axiosPost = (url, data, success, failure) => {
  axios({
    method: 'post',
    url,
    data,
    headers: {
      Authorization: cookie.get('token')
    },
  })
    .then(success)
    .catch((err) => {
      if (err) {
        failure(err);
      }
    });
};

export const axiosPut = (url, data, success, failure) => {
  axios({
    method: 'put',
    url,
    data,
    headers: {
      Authorization: cookie.get('token')
    }
  })
    .then(success)
    .catch((err) => {
      if (err) {
        failure(err);
      }
    });
};

export const axiosDelete = (url, data, success, failure) => {
  axios({
    method: 'delete',
    url,
    data,
    headers: {
      Authorization: cookie.get('token')
    }
  })
    .then(success)
    .catch((err) => {
      if (err) {
        failure(err);
      }
    });
};

export const axiosPostFile = (url, file, success, failure) => {
  let data = new FormData();
  data.append('file', file);
  axios({
    method: 'post',
    url,
    data,
    headers: {
      Authorization: cookie.get('token')
    }
  })
    .then(success)
    .catch((err) => {
      if (err) {
        failure(err);
      }
    });
};
