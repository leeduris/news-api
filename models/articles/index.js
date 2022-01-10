const ArticleDB = require('../../db/articles')

exports.getAll = async () => {
    const result = await ArticleDB.find({}).lean();
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.getById = async (id) => {
    const result = await ArticleDB.findById(id).lean()
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.getByCategory = async (category) => {
    const result = await ArticleDB.find({category: category}).sort({ publishedAt: 'desc'}).lean();
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.create = async (article) => {
    try {
        const newArticle = await ArticleDB.create(article);
        newArticle.save()
        return newArticle
    } catch (err) {
        throw err
    }
}

exports.updateById = async (id, updated) => {
    const result = ArticleDB.findOneAndUpdate({_id: id}, updated, 
        {new: true})
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.removeById = async (id) => {
    const result = ArticleDB.remove({_id: id}, {single: true})
    if (!result) {
        return null
    } else {
        return result
    }
}

exports.getByUrl= async (url) => {
    const result = await ArticleDB.findOne({url: url}).lean()

    if (!result) {
        return null
    } else {
        return new ArticleDB(result);
    }
}


