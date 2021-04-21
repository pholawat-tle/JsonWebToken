const cors = require('cors');
const express = require('express');
const logger = require('morgan');

const databaseFunctions = require('./functions/databaseFunctions');
const jwtFunctions = require('./functions/jwtFunctions.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.get('/me', jwtFunctions.authenticateToken, databaseFunctions.getMe);

app.get('/users', jwtFunctions.authenticateToken, databaseFunctions.getUsers);

app.post('/users', databaseFunctions.createUser);

app.post('/users/login', databaseFunctions.logIn);

app.post('/users/logout', databaseFunctions.logOut);

app.post('/token', jwtFunctions.renewAccessToken);

app.listen(5000, () => {
    console.log(`Listening to Port 5000`);
});
