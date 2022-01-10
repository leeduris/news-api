const { makeExecutableSchema } = require('graphql-tools');
const { resolvers } = require('./resolvers');

const typeDefs = `
scalar DateTime
type User { 
    _id: ID! 
    firstName: String! 
    lastName: String! 
    phoneNumber: String
    email: String! 
    password: String! 
    role: String!
    article: [String]
    created: DateTime!
} 
type Article {
    _id: ID!
    url: String!
    source: String 
    category: String!
    author: String
    publishedAt: DateTime
    title: String
    description: String
    content: String
    urlToImage: String
    created: DateTime
}
type Query {
    getUserById(_id: ID!): User 
    allUsers: [User]
    getArticleByCatetogy(category: String!): [Article]
    allArticles: [Article]
}
input UserInput {
    firstName: String! 
    lastName: String! 
    phoneNumber: String
    email: String! 
    password: String! 
    role: String!
    article: [String]
    created: DateTime!
}
input ArticleInput {
    _id: ID!
    url: String!
    source: String 
    category: String!
    author: String
    publishedAt: DateTime
    title: String
    description: String
    content: String
    urlToImage: String
    created: DateTime
}
type Mutation {
    createUser(input: UserInput): User
}
`;

exports.schema = makeExecutableSchema({ typeDefs, resolvers });