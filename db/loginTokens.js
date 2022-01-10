const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const LoginTokenSchema = new mongoose.Schema({
    userId: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // connect with Users.js
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenExpires: {
        type: Date,
        required: true,
    },
    refreshTokenExpires: {
        type: Date,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    updated: {
        type: Date,
    }
})

LoginTokenSchema.pre('findOneAndUpdate', async function(next) {
    this.updated = Date.now();
    next();
})

LoginTokenSchema.statics.verifyAccessToken = function(accessToken, cb) {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) return cb(err);
        cb(null, decoded.userId);
    })
}

LoginTokenSchema.statics.verifyRefreshToken = function(refreshToken, cb) {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, decoded) {
        if (err) return cb(err);
        cb(null, decoded.userId);
    })
}

module.exports = mongoose.model('LoginToken', LoginTokenSchema);
