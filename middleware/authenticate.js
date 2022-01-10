const jwt = require('jsonwebtoken')

const serverAuthenticate = (req, res, next) => {
    const token = req.get('server-api-key');
    if (!token) {
        return res.status(401).json('missing token');
    }

    const decodedToken = jwt.verify(
        token, 
        process.env.SERVER_API_KEY,
        (err, payload) => {
            if (err) {
                return res.sendStatus(401)
            }
            next()
        }
    )
};

const clientVerify = (req, res, next) => {
    const accessToken = req.cookies.jwt;

    if (!accessToken) {
        return res.status(403).send();
    }

    let payload
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        if (!payload) {
            return res.status(403).send();
        }

        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).send();
    }
}

module.exports = {
    serverAuthenticate,
    clientVerify
}