const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Такой карточки не существует'));
    }
    if (!card.owner.equals(userId)) {
      return next(new ForbiddenError('Ошибка прав доступа'));
    }
    await card.remove();
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Невалидный ID карточки'));
    }
    return next(err);
  }
};

const handleLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Такой карточки не существует'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Невалидный ID карточки'));
    }
    return next(err);
  }
};

const handleLikeRemove = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Такой карточки не существует'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Невалидный ID карточки'));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  handleLikeCard,
  handleLikeRemove,
};
