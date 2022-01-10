const LoginTokenDB = require('../../db/loginTokens');
const CreateError = require('http-error');

const auth = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const accessToken = bearerToken.split(" ")[1];

    if (!accessToken) res.status(401).send();

    LoginTokenDB.verifyAccessToken(accessToken, (err, userId) => {
        if (err) return new CreateError.Unauthorized(err);

        if (!userId) return new CreateError.Unauthorized();

        req.userId = userId;
        next();
    })
}

module.exports = {
    auth,
}