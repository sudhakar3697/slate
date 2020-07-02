const jwt = require('jsonwebtoken');
const config = require('../config.js');
const userSessionInfo = require('../models/user-session-info.js');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.SECRET_KEY);
      const record = await userSessionInfo.findOne({
        where: {
          id: decoded.id,
          sessionId: decoded.sessionId,
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
