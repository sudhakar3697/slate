const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config.js');
const logger = require('./custom-logger.js');

const app = express();

app.use(helmet());

app.use(
  morgan(
    ':date[clf] :user-agent :method :referrer :remote-addr :remote-user :url :status :res[content-length] - :response-time ms',
    {
      stream: { write: (message) => logger.info(message) },
    },
  ),
);

const usersRouter = require('./routes/users.js');

app.use('/users', usersRouter);

app.listen(config.PORT, () => {
  logger.info(`App is listening at ${config.PORT}`);
});
