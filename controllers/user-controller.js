const userInfo = require('../models/user-info.js');

module.exports = {
  getUsers: async (req, res) => {
    res.json(await userInfo.findAll({}));
  },
};
