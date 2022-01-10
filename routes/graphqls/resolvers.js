const UserModel = require('../../models/users');
const ArticleModel = require('../../models/articles');

exports.resolvers = {
    Query: {
        async allUsers() { return await UserModel.getAll(); },
        async allArticles() { return await ArticleModel.getAll(); },
        async getUserById(root, {_id}) { return await UserModel.getById(_id); },
        async getArticleByCatetogy(root, { category }) { return await ArticleModel.getByCategory(category)}
    },

    Mutation: {
        async createUser(root, { input }) { return await UserModel.create(input); }
    }
}