const UserDB = require('../../db/users')

exports.getAll = async () => {
    const result = await UserDB.find({}).lean()
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.getById = async (id) => {
    const result = await UserDB.findById(id).lean()
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.create = async (user) => {
    try {
        const newUser = await UserDB(user)
        newUser.save()
        return newUser
    } catch (err) {
        throw err
    }
}

exports.updateById = async (id, updated) => {
    const result = await UserDB.findOneAndUpdate({_id: id}, updated,
        {new: true})
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.deleteById = async (id) => {
    const result = await UserDB.remove({_id: id}, {single: true})
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.getByEmail= async (email) => {
    const result = await UserDB.findOne({email: email}).lean()

    if (!result) {
        return null
    } else {
        return new UserDB(result);
    }
}