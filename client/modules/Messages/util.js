export const chunk = (str, n) => {
  const ret = [];
  let i;
  let len;

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n));
  }

  return ret;
};
