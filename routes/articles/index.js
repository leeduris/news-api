const axios = require('axios');

const articleModel = require('../../models/articles/');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.getAll();
        if (!articles) {
            return res.status(400).send()
        }

        return res.status(200).json({
            success: true,
            data: articles
        })

    } catch (err) {
        return res.status(500).send()
    }
}

exports.getArticleById = async (req, res) => {
    try {
        const id = req.params.id
        const article = await articleModel.getById(id)

        if (!article) {
            return res.status(400).send()
        }

        return res.status(200).json({
            success: true,
            data: article
        })
    } catch (err) {
        return res.status(500).send()
    }
}

exports.getArticleByCategory = async (req, res) => {
    try {
        const category = req.params.category
        const articles = await articleModel.getByCategory(category)

        if (!articles) {
            return res.status(400).send()
        }

        return res.status(200).json({
            success: true,
            data: articles
        })
    } catch (err) {
        return res.status(500).send()
    }
}

exports.createArticle = async (req, res) => {
    try {
        const baseUrl = "https://newsapi.org/v2/";
        const endPoint = "top-headlines";
        const country = "us";
        const categories = ["general", "business", "entertainment", "technology", "health", "science", "sports"];
        const apiKey = process.env.NEWS_API_KEY;

        const url = (category) => {
            return baseUrl + endPoint + "?" + "country=" + country + "&" + "category=" + category + "&" + "apiKey=" + apiKey;
        } 

        const createArticles = async (articles, category) => {
            for (let article of articles) {
                if (!article.url || !article.urlToImage || !article.content) {
                    continue;
                }
                const existedUrl = await articleModel.getByUrl(article.url);
                if (!existedUrl) {
                    const newArticle = {
                        url: article.url,
                        category,
                        source: article.source.name || "",
                        author: article.author || "",
                        publishedAt: article.publishedAt || "",
                        title: article.title || "",
                        description: article.description || "",
                        content: article.content || "",
                        urlToImage: article.urlToImage || "",
                    }
                    await articleModel.create(newArticle);
                } 
            }
        }

        for (let category of categories) {
            const newUrl = url(category);
            const result = await axios.get(newUrl);
            const articles = result.data.articles;

            if (articles.length > 0) {
                await createArticles(articles, category);
            }
        }

        return res.status(201).send();
    } catch (err) {
        return res.status(500).send()
    }
}

exports.updateArticle = async (req, res) => {
    try {
        const id = req.params.id
        const updated = req.body

        const article = await articleModel.updateById(id, updated)

        if (!article) {
            return res.status(400).send()
        }

        return res.status(200).json({
            success: true,
            data: article
        })

    } catch (err) {
        return res.status(500).send()
    }
}

exports.deleteArticle = async (req, res) => {
    try {
        const id = req.params.id

        const deleted = await articleModel.removeById(id)

        if (deleted.deletedCount === 0) {
            return res.status(400).send()
        }

        return res.status(200).json({
            success: true,
            data: deleted.deletedCount
        })
    } catch (err) {
        return res.status(500).send()
    }
}

