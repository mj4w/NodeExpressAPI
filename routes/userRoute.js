const express = require('express');
const { createUser, loginUser, getAllUsers, getUsers, deleteUsers, updateUsers, unblockUser, blockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken } = require('../controllers/userControl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUser);
router.get('/all-users',getAllUsers);
router.get('/refresh',handleRefreshToken);
router.get('/logout',logout);
router.get('/:id',authMiddleware,isAdmin,getUsers);
router.delete('/delete/:id',deleteUsers);
router.put('/update',authMiddleware,isAdmin,updateUsers);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);
//update password
router.put('/password',authMiddleware,updatePassword);
// forgot password token
router.post('/forgot-password-token',forgotPasswordToken);



module.exports = router;