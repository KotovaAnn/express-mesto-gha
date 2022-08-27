const User = require('../models/user');

const STATUS_OK = 200;
const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_OK).send(users);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const getUserbyId = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Такого пользователя не существует' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Невалидный ID пользователя' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка в запросе' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const profileUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Такого пользователя не существует' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Данные пользователя переданы некорректно' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const avatarUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Такого пользователя не существует' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Данные переданы некорректно' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getUsers,
  getUserbyId,
  createUser,
  profileUpdate,
  avatarUpdate,
};
