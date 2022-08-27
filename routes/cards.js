const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  handleLikeCard,
  handleLikeRemove,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteCardById);
cardRouter.put('/cards/:cardId/likes', handleLikeCard);
cardRouter.delete('/cards/:cardId/likes', handleLikeRemove);

module.exports = {
  cardRouter,
};
