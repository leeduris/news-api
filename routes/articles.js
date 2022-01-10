const express = require('express');
const router = express.Router();

const articles = require('./articles/');
const { auth } = require('../middleware/auth/auth');

// @desc    Shows all news
// @route   GET /news
router.get('/api/articles', auth, articles.getAllArticles)

// @desc    Shows single news
// @route   GET /news/:id
router.get('/api/articles/:id', auth, articles.getArticleById)
router.get('/api/articles/:category', auth, articles.getArticleByCategory)

// @desc    Process add news
// @route   POST /news
router.post('/api/articles', auth, articles.createArticle)

// @desc    Update news
// @route   PUT /news/:id
router.put('/api/articles/:id', auth, articles.updateArticle)

// @desc    Delete news
// @route   DELETE /news/:id
router.delete('/api/articles/:id', auth, articles.deleteArticle)

module.exports = router