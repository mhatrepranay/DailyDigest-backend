import express from 'express';
import multer from 'multer';
import ArticleModel1 from '../models/Newsmodel.js';


const newsrouter = express.Router();

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

newsrouter.get('/articles', async (req, res) => {
    try {
        const articles = await ArticleModel1.find({});
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET a specific article by ID
newsrouter.get('/articles/:id', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST route to create a new article
newsrouter.post('/articles', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, category, user } = req.body;

        const imageData = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

        const newArticle = new ArticleModel1({
            title,
            content,
            author,
            category,
            image: imageData,
            user: JSON.parse(user) // Assuming user is passed as a JSON string
        });

        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update route for a specific article
newsrouter.put('/articles/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, category } = req.body;
        let updatedArticleData = {
            title,
            content,
            author,
            category
        };

        if (req.file) {
            updatedArticleData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const updatedArticle = await ArticleModel1.findByIdAndUpdate(
            req.params.id,
            updatedArticleData,
            { new: true } // Return the updated document
        );

        if (!updatedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.status(200).json(updatedArticle);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete route for a specific article
newsrouter.delete('/articles/:id', async (req, res) => {
    try {
        const deletedArticle = await ArticleModel1.findByIdAndDelete(req.params.id);

        if (!deletedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Route to like an article
newsrouter.post('/articles/:id/like', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.id);
        article.likes += 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error liking article' });
    }
});
newsrouter.post('/articles/:id/unlike', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.id);
        article.likes -= 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error liking article' });
    }
});

// Route to dislike an article
newsrouter.post('/articles/:id/dislike', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.id);
        article.dislikes += 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error disliking article' });
    }
});
newsrouter.post('/articles/:id/undislike', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.id);
        article.dislikes -= 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error disliking article' });
    }
});


// Route to add a comment to an article
newsrouter.post('/articles/:id/comments', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.id);
        const comment = {
            user: req.body.user,
            content: req.body.content
        };
        article.comments.push(comment);
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error adding comment' });
    }
});

// Route to like a comment
newsrouter.post('/articles/:articleId/comments/:commentId/like', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.articleId);
        const comment = article.comments.id(req.params.commentId);
        comment.likes += 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error liking comment' });
    }
});
newsrouter.post('/articles/:articleId/comments/:commentId/unlike', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.articleId);
        const comment = article.comments.id(req.params.commentId);
        comment.likes -= 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error liking comment' });
    }
});

// Route to dislike a comment
newsrouter.post('/articles/:articleId/comments/:commentId/dislike', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.articleId);
        const comment = article.comments.id(req.params.commentId);
        comment.dislikes += 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error disliking comment' });
    }
});
newsrouter.post('/articles/:articleId/comments/:commentId/undislike', async (req, res) => {
    try {
        const article = await ArticleModel1.findById(req.params.articleId);
        const comment = article.comments.id(req.params.commentId);
        comment.dislikes -= 1;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error disliking comment' });
    }
});

newsrouter.get('/categories', async (req, res) => {
    try {
        const categories = await ArticleModel1.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





export default newsrouter;
