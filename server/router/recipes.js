//root/router/recipes.js

const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController, commentController } = require('../controllers');

router.get('/latest', recipeController.getLatestRecipes);
router.get('/category', recipeController.getRecipesByCategory);
router.get('/', recipeController.getAllRecipes);
router.post('/', auth(), recipeController.createRecipe);
router.get('/:recipeId', recipeController.getRecipeById);
router.put('/:recipeId', auth(), recipeController.editRecipe);
router.delete('/:recipeId', auth(), recipeController.deleteRecipe);
router.put('/:recipeId/favorite', auth(), recipeController.toggleFavorite);

router.post('/:recipeId', auth(), commentController.createComment);
router.put('/:recipeId/comments/:commentId', auth(), commentController.editComment);
router.put('/:recipeId/comments/:commentId/like', auth(), commentController.likeComment);
router.delete('/:recipeId/comments/:commentId', auth(), commentController.deleteComment);

module.exports = router;