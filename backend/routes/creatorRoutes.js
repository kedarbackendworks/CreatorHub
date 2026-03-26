const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  updateSocialLinks,
  getSocialLinks
} = require('../controllers/creatorController');

router.get('/dashboard', getDashboardData);

// Post routing
router.post('/posts', createPost);
router.get('/posts', getPosts);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Social links routing
router.get('/social-links', getSocialLinks);
router.post('/social-links', updateSocialLinks);

module.exports = router;
