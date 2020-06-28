const bcrypt = require('bcrypt');
const userInfo = require('../models/user-info.js');

const saltRounds = 10;

module.exports = {
  getUsers: async (req, res) => {
    try {
      res.json(await userInfo.findAll({}));
    } catch (err) {
      res.json(err);
    }
  },
  addUser: async (req, res) => {
    try {
      const {
        password, id, name, email,
      } = req.body;
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      await userInfo.create({
        id,
        name,
        password: encryptedPassword,
        email,
        verified: false,
      });
      res.send('User added');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
};
