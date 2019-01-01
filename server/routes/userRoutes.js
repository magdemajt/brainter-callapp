
const express = require('express');
const {
  validateUserToken,
  getAuthUser,
  updateUser,
  addAuthTags,
  updateUserWithTags,
  updatePhoto,
  getImage,
  updatePassword,
  updateUserMail
} = require('../controllers/userController');
const {
  getUser,
  getUsers,
  getUsersByTags,
} = require('../controllers/usersController');

const router = express.Router();
router.use(validateUserToken);
/* GET users listing. */
router.get('/auth', getAuthUser);
router.put('/auth', updateUser);
router.put('/auth/email', updateUserMail)
router.put('/auth/pass', updatePassword);
router.put('/auth/tags', updateUserWithTags);
router.post('/auth/tags', addAuthTags);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.get('/user/photo/:id', getImage);
router.post('/auth/photo', updatePhoto);
router.post('/users/tags', getUsersByTags);

module.exports = router;
