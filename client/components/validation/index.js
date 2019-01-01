const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// One number one large and one small minimum 8 chars.
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const regexRegex = /[.*+?^${}()|[\]\\]/g;
const alphaNumRegex = /^[a-z\d\-_\s]+$/i;

export const checkIfNotNull = word => word !== '';
export const shorterThen = (shorter, word) => word.length < shorter;
export const longerThen = (longer, word) => word.length > longer;
export const validateNoRegex = string => !(regexRegex.test(string));
export const validatePassword = password => passwordRegex.test(password);
export const validateAlfaNumeric = word => alphaNumRegex.test(word);
export const validateEmail = email => checkIfNotNull(email) && emailRegex.test(email);
export const validateName = name => checkIfNotNull(name) && validateNoRegex(name) && shorterThen(50, name) && longerThen(3, name);
export const escapeRegExp = string => string.replace(regexRegex, '\\$&');
