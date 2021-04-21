const cors = require('cors');
const express = require('express');
const logger = require('morgan');

const databaseFunctions = require('./functions/databaseFunctions');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.get('/users', databaseFunctions.getUsers);

app.post('/users', databaseFunctions.createUser);

app.post('/users/login', databaseFunctions.logIn);

app.listen(5000, () => {
    console.log(`Listening to Port 5000`);
});
