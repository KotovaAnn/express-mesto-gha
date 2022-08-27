const userRouter = require('express').Router();
const {
  getUsers,
  getUserbyId,
  createUser,
  profileUpdate,
  avatarUpdate,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserbyId);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', profileUpdate);
userRouter.patch('/users/me/avatar', avatarUpdate);

module.exports = {
  userRouter,
};
