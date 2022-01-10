const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
    },
    source: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    publishedAt: {
        type: Date,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    content: {
        type: String,
    },
    urlToImage: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Article", ArticleSchema);