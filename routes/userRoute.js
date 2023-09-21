const express = require('express');
const { createUser, loginUser, getAllUsers, getUsers, deleteUsers, updateUsers } = require('../controllers/userControl');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUser);
router.get('/all-users',getAllUsers);
router.get('/:id',getUsers);
router.delete('/delete/:id',deleteUsers);
router.put('/update/:id',updateUsers);



module.exports = router;