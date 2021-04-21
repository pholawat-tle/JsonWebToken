require('dotenv').config();
const jwt = require('jsonwebtoken');

let refreshTokens = [];

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s',
    });
}

function generateRefreshToken(user) {
    const refreshTokenGenerated = jwt.sign(
        user,
        process.env.REFRESH_TOKEN_SECRET
    );
    refreshTokens.push(refreshTokenGenerated);
    return refreshTokenGenerated;
}

function authenticateToken(req, res, next) {
    const token =
        req.headers['authorization'] &&
        req.headers['authorization'].split().length &&
        req.headers['authorization'].split(' ')[1];
    if (token == null) {
        return res.status(401).send();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function removeToken(token) {
    refreshTokens = refreshTokens.filter((tokenInArr) => tokenInArr !== token);
}

function renewAccessToken(req, res) {
    const refresh_token = req.body.token;
    if (refresh_token == null) {
        return res.status(401).send();
    }
    if (!refreshTokens.includes(refresh_token)) return res.status(403).send();

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send();
        console.log(user);
        const access_token = generateAccessToken({
            username: user.username,
            password: user.password,
        });
        res.send({ access_token });
    });
}

module.exports = {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
    removeToken,
    renewAccessToken,
};
