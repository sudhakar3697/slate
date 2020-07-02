const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../custom-logger.js');
const config = require('../config.js');
const userInfo = require('../models/user-info.js');
const userSessionInfo = require('../models/user-session-info.js');

function encodeRegistrationToken(id) {
  const token = jwt.sign({ id }, config.SECRET_KEY);
  return token;
}

function decodeRegistrationToken(token) {
  const decoded = jwt.verify(token, config.SECRET_KEY);
  const dateNow = new Date();
  const tokenTime = decoded.iat * 1000;
  const tokenLife = 3600000;

  if (tokenTime + tokenLife < dateNow.getTime()) {
    return { expired: true };
  }

  return {
    id: decoded.id,
  };
}

async function sendConfirmationMail(token, mailId) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.CONFIRMATION_MAIL,
      pass: config.CONFIRMATION_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Slate - Online Clipboard" <${config.CONFIRMATION_MAIL}>`,
    to: mailId,
    subject: 'Confirm your account on Slate',
    html: `<a href='${config.BASE_URL}/users/verification?token=${token}'>Click here to confirm</a>`,
  };

  const response = await transporter.sendMail(mailOptions);
  logger.info(response.messageId);
}

module.exports = {
  addUser: async (req, res) => {
    try {
      const {
        password, id, name, email,
      } = req.body;
      const encryptedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
      await userInfo.create({
        id,
        name,
        password: encryptedPassword,
        email,
        verified: false,
      });
      const token = encodeRegistrationToken(id);
      sendConfirmationMail(token, email);
      res.send('User added');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  showVerifyUserUI: async (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Slate - Email verification</title>
    </head>
    <body>
        <button onclick="sendConfirmation()">Click here to verify your email</button>
        <script>
            async function sendConfirmation() {
                let response = await fetch('${config.BASE_URL}/users/verification', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: '${req.query.token}' })
            });
            response = await response.text();
            alert(response);
    }
        </script>
    </body>
    </html>
    `);
  },
  verifyUser: async (req, res) => {
    try {
      const { id, expired } = decodeRegistrationToken(req.body.token);
      if (expired) {
        res.send('Verification email expired. Resend confirmation email to verify.');
      } else {
        const record = await userInfo.findByPk(id);
        await record.update({ verified: true });
        res.send('Successfully verified your account. You may close this window.');
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  resendConfirmationEmail: async (req, res) => {
    try {
      const record = await userInfo.findByPk(req.user.id);
      const token = encodeRegistrationToken(record.id);
      sendConfirmationMail(token, record.email);
      res.send('Confirmation mail has been sent');
    } catch (err) {
      res.status(400).send('Confirmation mail not sent');
    }
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const record = await userInfo.findOne({ where: { email: req.body.email } });
      const token = encodeRegistrationToken(record.id);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.CONFIRMATION_MAIL,
          pass: config.CONFIRMATION_MAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Slate - Online Clipboard" <${config.CONFIRMATION_MAIL}>`,
        to: req.body.email,
        subject: 'Reset your Slate Account Password',
        html: `<a href='${config.BASE_URL}/users/password-reset?token=${token}'>Click here to reset your password</a>`,
      };
      const response = await transporter.sendMail(mailOptions);
      logger.info(response.messageId);
      res.send('Reset password mail has been sent');
    } catch (err) {
      res.status(404).send('Account does not exist');
    }
  },
  showResetPasswordUI: async (req, res) => {
    res.send(`<!DOCTYPE html>
      <html>
      <head>
          <title>Slate - Change Password</title>
      </head>
      <body>
          New Password: <input type="password" id="new-password">
         <!-- Confirm Password:<input type="password" id="confirm-password"> -->
          <button onclick="changePassword()">Reset password</button>
          <script>
              async function changePassword() {
                  let response = await fetch('${config.BASE_URL}/users/password-reset', {
                      method: 'PATCH',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ token:'${req.query.token}',password:document.getElementById('new-password').value })
              });
              response = await response.text();
              alert(response);
      }
          </script>
      </body>
      </html>`);
  },
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      const decodedUserId = await decodeRegistrationToken(token).id;
      const record = await userInfo.findByPk(decodedUserId);
      const encryptedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
      await record.update({ password: encryptedPassword });
      await userSessionInfo.destroy({
        where: { id: decodedUserId },
      });
      res.send('Password changed successfully');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const record = await userInfo.findByPk(req.user.id);
      if (record) {
        res.send(record);
      } else {
        res.status(404).send();
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  signIn: async (req, res) => {
    try {
      const { id, password } = req.body;
      const record = await userInfo.findByPk(id);
      if (await bcrypt.compare(password, record.password)) {
        const sessionId = Date.now().toString();
        const token = jwt.sign({ id, sessionId }, config.SECRET_KEY);
        await userSessionInfo.create({
          id,
          sessionId,
        });
        res.send(token);
      } else {
        res.status(403).send('Incorrect Username/Password');
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  signOut: async (req, res) => {
    try {
      await userSessionInfo.destroy({
        where: {
          id: req.user.id,
          sessionId: req.user.sessionId,
        },
      });
      res.send('You have been logged out');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  deleteAccount: async (req, res) => {
    try {
      await userSessionInfo.destroy({
        where: {
          id: req.user.id,
        },
      });
      await userInfo.destroy({
        where: {
          id: req.user.id,
        },
      });
      res.send('You account has been deleted');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  changePassword: async (req, res) => {
    try {
      const record = await userInfo.findByPk(req.user.id);
      const encryptedPassword = await bcrypt.hash(req.body.password, config.SALT_ROUNDS);
      await record.update({
        password: encryptedPassword,
      });
      await userSessionInfo.destroy({
        where: { id: req.user.id },
      });
      res.send('Password changed successfully');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
  editProfile: async (req, res) => {
    try {
      const record = await userInfo.findByPk(req.user.id);
      await record.update({
        name: req.body.name,
        email: req.body.email,
        verified: (req.body.email === record.email && record.verified),
      });
      if (!record.verified) {
        const token = encodeRegistrationToken(req.user.id);
        sendConfirmationMail(token, record.email);
      }
      res.send('Profile updated successfully');
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
};
