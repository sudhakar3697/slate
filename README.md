# slate
Online Clipboard

### Features
* Public slates (Limit in no of characters of a slate, No support for custom slate ID )
* User Signup (Username, Password & Google Sign-in)
* User Authentication
* Slate creation for authenticated users (Support for customizing slate ID, Sharing slates with or without edit)
* Delete slates
* Expiry of slates(For public slates default expiry 24hrs)
* Notification

### Tech stack
* Express.js
* PostgreSQL with Sequelize ORM
* REST API
* Authentication (Token based - JWT)

* Security (use helmet, cors, csurf, bcrypt, jwt, Limit concurrent requests, account lockout)
* Performance (NODE_ENV=production, Enable Gzip Compression (compression), Load balancing (cluster module))
* Logging (morgan, winston)
* Caching (Redis)
* Linting (ESLint - airbnb, eslint-plugin-node, eslint-plugin-node-security)
* Code formatting (VS Code default)
* dotenv
* nodemon
* Testing
* Documentation
* Hosting, Deployment (Heroku)

### Design 
<a href="https://docs.google.com/document/d/1xyy0rbtOf97NGG6-cxt6A6X5RAbLr-rocIHkKvGjZ0Y/edit?usp=sharing">Link to Google Doc</a>
