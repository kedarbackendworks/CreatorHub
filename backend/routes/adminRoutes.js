const express = require('express');
const router = express.Router();
const { getAllData, updateUser, deleteUser, updateSettings, getUserDetails } = require('../controllers/adminController');

router.get('/data', getAllData);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.get('/user/:id', getUserDetails);
router.put('/settings', updateSettings);

module.exports = router;
