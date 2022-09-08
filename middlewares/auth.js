const jwt = require('jsonwebtoken');

const UNAUTHORIZED_ERROR = 401;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(UNAUTHORIZED_ERROR).send({ message: 'Неправильные почта или пароль' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
