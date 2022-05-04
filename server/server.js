/** Getting enviroment variables */
const dotenv = require('dotenv');
const config = dotenv.config();

/** Express */
const express = require('express');

/** Swagger jsdoc and swagger ui */
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

/** MongoClient to connect to the database and set the singleton instance */
const MongoClient = require('mongodb').MongoClient;
const Database = require('./src/models/database.model.js');

/** Constants and env variables */
const PORT = process.env.PORT || 3000;

/** Express and routers */
const app = express();
const mainRouter = require('./src/routes');

/** Express Sessions */
const session = require('express-session');

/** Swagger configuration */
const swaggerOptions = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'Tuksbet',
      description: 'Tuksbet api documentation',
      version: '1.0.0',
      servers: ['http://localhost:' + PORT],
    },
  },
  apis: ['./server.js', './src/routes/**/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/** Express Session Middleware for Lex Chatbot */
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

/** Express middlewares */
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Use of routers */
app.use('/api', mainRouter);

MongoClient.connect(
  process.env.DB_URL,
  {
    useUnifiedTopology: true,
  },
  function (err, client) {
    if (err) {
      console.log(err);
      console.log('Failed to connect to MongoDB');
    } else {
      console.log('Succesfully connected to MongoDB');
      database = client.db();
      Database.setDatabase(database);

      /** We use an http server to handle both express and socket.io communication on the same port*/
      const server = require('http').createServer(app);
      /** WebSocket Server */
      const io = require('socket.io')(server, {
        cors: {
          origin: '*',
        },
      });

      server.listen(PORT, () => {
        const setMainSocketInstance = require('./src/socketEvents');
        /** Event handlers for real time communication */
        setMainSocketInstance(io);
        console.log('Server listening on port:', PORT, 'http://localhost:' + PORT);
      });
    }
  }
);
