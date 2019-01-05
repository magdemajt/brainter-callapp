const express = require('express');
const { validateUserToken } = require('../controllers/userController');
const {
    checkIfAdmin,
    getMessageStats,
    getMessageUserStats,
    getPermission,
    getUsersStats
} = require('../controllers/adminController');

const router = express.Router();

router.use(validateUserToken, checkIfAdmin);

router.get('/admin/userstats/:selectedDate', getUsersStats);

router.get('/admin', getPermission);

router.get('/admin/msgstats/:selectedDate', getMessageStats);

router.get('/admin/msguserstats/:selectedDate', getMessageUserStats);

module.exports = router;
