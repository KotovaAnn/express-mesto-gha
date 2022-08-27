const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const INTERNAL_SERVER_ERROR = 500;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6308d7293d981d5e4b5e348e',
  };

  next();
});
app.use(userRouter);
app.use(cardRouter);

async function main(res) {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
    return;
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
