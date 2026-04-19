//root/router/comments.js

const express = require('express');
const router = express.Router();
const { commentController } = require('../controllers');

router.get('/', commentController.getLatestComments);

module.exports = router;
