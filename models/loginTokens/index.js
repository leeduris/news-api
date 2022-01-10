const LoginTokenDB = require('../../db/loginTokens');
const CreateError = require('http-error');

exports.create = async (loginToken) => {
    try {
        const newLoginToken = new LoginTokenDB(loginToken)
        newLoginToken.save()
        return newLoginToken
    } catch (err) {
        return CreateError.BadRequest('create: newLoginToken not saved')
    }
}

exports.getByUserId= async (userId) => {
    const result = await LoginTokenDB.findOne({userId: userId}).lean()
    if (!result) {
        return null
    } else {
        return new LoginTokenDB(result);
    }
}

exports.updateByUserId = async (userId, updated) => {
    const result = await UserDB.findOneAndUpdate({userId: userId}, updated,
        {new: true})
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.deleteAllByUserId = async (userId) => {
    try {
        const result = await LoginTokenDB.remove({userId: userId}, {single: true})
        return result;
    } catch (err) {
        return new CreateError.BadRequest("Token not removed")
    }
}