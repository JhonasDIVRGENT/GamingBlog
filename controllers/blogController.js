// Blog Controller
const express = require('express');
const router = express.Router();
const blogDAL = require('../dal/blogDAL');

// Get all posts
router.get('/', async (req, res) => {
    const posts = await blogDAL.getAllPosts();
    res.render('blog/index', { posts });
});

module.exports = router;
