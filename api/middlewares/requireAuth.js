const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
  //console.log(req);
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

  if (!authorization) {
    return res.status(401).send({ error: 'You must be logged in.' });
  }

  const token = authorization.replace('Bearer ', '');


  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in.' });
    }

    const { userId, mobile, name } = payload;
    req.userId = userId;
    req.phone = mobile;
    req.name = name;
    next();
  });
};
