const express = require('express');
const { addTag, getTags } = require('../controllers/tagsController');
const { validateUserToken } = require('../controllers/userController');

const router = express.Router();

// router.use(validateUserToken);

router.get('/tags', getTags);

router.post('/tags', addTag);

module.exports = router;
