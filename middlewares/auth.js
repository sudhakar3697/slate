const jwt = require('jsonwebtoken');
const config = require('../config.js');
const userInfo = require('../models/user-info.js');
const userSessionInfo = require('../models/user-session-info.js');

function getUserId(req) {
  if (req.params.id) {
    return req.params.id;
  }
  if (req.body.id) {
    return req.body.id;
  }
  if (req.query.id) {
    return req.query.id;
  }
  throw new Error({ name: 'Missing id parameter', message: 'Missing id parameter' });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const id = getUserId(req);
      const hashedPassword = (await userInfo.findByPk(id)).password;
      const decoded = jwt.verify(token, config.SECRET_KEY + hashedPassword);
      const record = await userSessionInfo.findOne({
        where: {
          id,
          sessionId: decoded.sessionId.toString(),
        },
      });
      if (!record) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      return next();
    } catch (err) {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401);
  }
};
