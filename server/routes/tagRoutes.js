const express = require('express');
const { addTag, getTags } = require('../controllers/tagsController');
const { validateUserToken } = require('../controllers/userController');
const { checkIfAdmin } = require('../controllers/adminController');
const router = express.Router();

router.use(validateUserToken);

router.get('/tags', getTags);

router.post('/tag', checkIfAdmin, addTag);

module.exports = router;
