const errors = require('./errorStatusCodes');

module.exports = (errorCode) => {
  switch (errorCode) {
    case errors.emailAlreadyInDB: {
      return 'Email already in database';
    }
    case errors.passwordsDoNotMatch: {
      return 'Passwords do not match';
    }
    case errors.invalidPassword: {
      return 'Invalid password';
    }
    default: {
      return 'Internal Server Error';
    }
  }
};
