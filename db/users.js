const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CreateError = require('http-error');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, 
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    article: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article'
    }],
    created: {
        type: Date, 
        default: Date.now
    }
})

UserSchema.pre('save', async function(next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);

    this.password = hash;
    next()
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

// UserSchema.methods.comparePassword = function(password, cb) {
//     bcrypt.compare(password, this.password, function(err, isMatch){
//         if (err) return cb(err);
//         cb(null, isMatch);
//     })
// }

UserSchema.methods.generateAccessToken = function() {
    try {
        const user = this;
        return jwt.sign(
            {userId: user._id}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {algorithm: "HS256", expiresIn: parseInt(process.env.ACCESS_TOKEN_LIFE)}
        );
    } catch (err) {
        return new CreateError.BadRequest("generateAccessToken: access token not generated")
    }
}

UserSchema.methods.generateRefreshToken = function() {
    try {
        const user = this;
        return jwt.sign(
            {id: user._id}, 
            process.env.REFRESH_TOKEN_SECRET, 
            {algorithm: "HS256", expiresIn: parseInt(process.env.REFRESH_TOKEN_LIFE)}
        );
    } catch (err) {
        return new CreateError.BadRequest("generateRefreshToken: refresh token not generated")
    }
}

// allow search and save for users
module.exports = mongoose.model('User', UserSchema);