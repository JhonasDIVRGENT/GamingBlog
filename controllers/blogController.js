// Blog Controller
const express = require('express');
const router = express.Router();
const blogDAL = require('../dal/blogDAL');

// Create a new post
router.post('/create', async (req, res) => {
    const { title, content, userID } = req.body;
    try {
        const result = await blogDAL.createPost(title, content, userID);
        res.status(201).send({ message: 'Post created successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to create post' });
    }
});

// Render all posts in the blog
router.get('/', async (req, res) => {
    try {
        const posts = await blogDAL.getAllPosts();
        res.render('blog/index', { posts });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch posts' });
    }
});

// Create a new comment
router.post('/:postID/comments', async (req, res) => {
    const { content, userID } = req.body;
    const postID = req.params.postID;
    try {
        const result = await blogDAL.createComment(content, userID, postID);
        res.status(201).send({ message: 'Comment created successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to create comment' });
    }
});

// Get comments by post ID
router.get('/:postID/comments', async (req, res) => {
    const postID = req.params.postID;
    try {
        const comments = await blogDAL.getCommentsByPost(postID);
        res.status(200).send(comments);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch comments' });
    }
});

// Render details of a specific post
router.get('/:id', async (req, res) => {
    const postID = req.params.id;
    try {
        const post = await blogDAL.getPostById(postID);
        if (post) {
            res.render('blog/details', { post });
        } else {
            res.status(404).send({ error: 'Post not found' });
        }
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).send({ error: 'Failed to fetch post details' });
    }
});

// Update a post
router.put('/:id', async (req, res) => {
    const postID = req.params.id;
    const { title, content } = req.body;
    try {
        const result = await blogDAL.updatePost(postID, title, content);
        res.status(200).send({ message: 'Post updated successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to update post' });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const postID = req.params.id;
    try {
        const result = await blogDAL.deletePost(postID);
        res.status(200).send({ message: 'Post deleted successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete post' });
    }
});

// Update a comment
router.put('/comments/:commentID', async (req, res) => {
    const commentID = req.params.commentID;
    const { content } = req.body;
    try {
        const result = await blogDAL.updateComment(commentID, content);
        res.status(200).send({ message: 'Comment updated successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to update comment' });
    }
});

// Delete a comment
router.delete('/comments/:commentID', async (req, res) => {
    const commentID = req.params.commentID;
    try {
        const result = await blogDAL.deleteComment(commentID);
        res.status(200).send({ message: 'Comment deleted successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete comment' });
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const result = await blogDAL.registerUser(username, email, password, role);
        res.status(201).send({ message: 'User registered successfully', result });
    } catch (err) {
        res.status(500).send({ error: 'Failed to register user' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await blogDAL.loginUser(email, password);
        if (user) {
            res.status(200).send({ message: 'Login successful', user });
        } else {
            res.status(401).send({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to login user' });
    }
});

module.exports = router;
