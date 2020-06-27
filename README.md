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
* PostgreSQL
* Sequelize ORM
* REST API
* Auth (TBD- Session based vs Token based)

* use Helmet
* express-session, cors, csurf, bcrypt, jwt
* Limit concurrent requests using a middleware, account lockout
* NODE_ENV=production
* Enable Gzip Compression (compression)
* Logger (morgan, winston)
* cluster module,
* cache with Redis
* Test
* Documentation
* ESLint, eslint-plugin-node, eslint-plugin-node-security
* dotenv

### Design 
<a href="https://docs.google.com/document/d/1xyy0rbtOf97NGG6-cxt6A6X5RAbLr-rocIHkKvGjZ0Y/edit?usp=sharing">Link to Google Doc</a>
