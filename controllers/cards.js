const Card = require('../models/card');

const STATUS_OK = 200;
const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_OK).send(cards);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка в запросе' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Такой карточки не существует' });
    }
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Невалидный ID карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const handleLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Такой карточки нет' });
    }
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Невалидный ID карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const handleLikeRemove = async (req, res) => {
  try {
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Такой карточки нет' });
    }
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Невалидный ID карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  handleLikeCard,
  handleLikeRemove,
};
