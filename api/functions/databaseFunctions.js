const bcrypt = require('bcrypt');
const mariadb = require('mariadb');
const jwtFunctions = require('./jwtFunctions');
const pool = mariadb.createPool({
    host: 'db',
    user: 'root',
    password: 'pholawat555',
    database: 'authDB',
});

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection()
            .then(async function (connection) {
                await connection.query(
                    `CREATE TABLE IF NOT EXISTS user ( id int(11) not null auto_increment, username varchar(10) not null, password varchar(60) not null, primary key (id))`
                );
                resolve(connection);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

async function startDB() {
    let connection;
    let query = `CREATE TABLE IF NOT EXISTS user ( id int(11) not null auto_increment, username varchar(10) not null, password varchar(60) not null, primary key (id))`;
    try {
        connection = await getConnection();
        try {
            let arr = await connection.query(query);
            console.log('Initialize Database');
        } catch (err) {
            console.log('Query Error!');
            console.log(err);
        }
    } catch (err) {
        console.log('Database Connection Error!');
        console.log(err);
        res.status(500).send();
    } finally {
        if (connection) return connection.release();
    }
}

async function createUser({ body: { username, password } }, res) {
    if (username.length > 10) {
        res.status(400).send('This username is too long!');
        return;
    }
    if (await getUserByName(username)) {
        res.status(400).send('This username is already taken!');
        return;
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let connection;
    let query = `INSERT INTO user (username, password) VALUES ('${username.toLowerCase()}','${hashedPassword}');`;
    try {
        connection = await getConnection();
        try {
            let arr = await connection.query(query);
            res.status(201).send({ data: arr });
        } catch (err) {
            console.log('Query Error!');
            console.log(err);
            res.status(400).send();
        }
    } catch (err) {
        console.log('Database Connection Error!');
        console.log(err);
        res.status(500).send();
    } finally {
        if (connection) return connection.release();
    }
}

async function getUsers(req, res) {
    let connection;
    let query = `SELECT * from user;`;
    try {
        connection = await getConnection();
        try {
            let arr = await connection.query(query);
            res.status(200).send({ data: arr });
        } catch (err) {
            console.log('Query Error!');
            console.log(err);
            res.status(400).send();
        }
    } catch (err) {
        console.log('Database Connection Error!');
        console.log(err);
        res.status(500).send();
    } finally {
        if (connection) return connection.release();
    }
}

function getUserByName(username) {
    return new Promise(async (resolve, reject) => {
        let connection;
        let query = `SELECT * from user WHERE username='${username.toLowerCase()}';`;
        try {
            connection = await getConnection();
            try {
                let arr = await connection.query(query);
                resolve(arr && arr[0]);
            } catch (err) {
                console.log('Query Error!');
                console.log(err);
                reject(err);
            }
        } catch (err) {
            console.log('Database Connection Error!');
            console.log(err);
            reject(err);
        } finally {
            if (connection) return connection.release();
        }
    });
}

async function getMe(req, res) {
    if (req.user) res.send(req.user);
    else res.status(400).send();
}

async function logIn({ body: { username, password } }, res) {
    let user = await getUserByName(username);
    if (user) {
        try {
            if (await bcrypt.compare(password, user.password)) {
                const access_token = jwtFunctions.generateAccessToken({
                    username,
                    password: user.password,
                });
                const refresh_token = jwtFunctions.generateRefreshToken({
                    username,
                    password: user.password,
                });
                res.send({ access_token, refresh_token });
            } else {
                res.send('Try Again!');
            }
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    } else {
        res.status(400).send('Cannot find user!');
    }
}

async function logOut({ body: { token } }, res) {
    jwtFunctions.removeToken(token);
    res.status(204).send();
}

module.exports = {
    createUser,
    getUsers,
    getMe,
    logIn,
    logOut,
    startDB,
};
