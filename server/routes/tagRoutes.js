const express = require('express');
const { addTag, getTags } = require('../controllers/tagsController');
const { validateUserToken, checkIfActive } = require('../controllers/userController');
const { checkIfAdmin } = require('../controllers/adminController');

const router = express.Router();

router.use(validateUserToken, checkIfActive);

router.get('/tags', getTags);

router.post('/tag', checkIfAdmin, addTag);

module.exports = router;
