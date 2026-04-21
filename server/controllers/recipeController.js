//root/controllers/recipeController.js

const { recipeModel, userModel, commentModel } = require('../models');

function getAllRecipes(req, res, next) {
    recipeModel
        .find()
        .populate('userId')
        .populate({
            path: 'comments',
            populate: { path: 'userId' },
        })
        .then(recipes => res.status(200).json(recipes))
        .catch(next);
}

function getLatestRecipes(req, res, next) {
    const limit = Number(req.query.limit) || 3;

    recipeModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId')
        .populate({
            path: 'comments',
            populate: { path: 'userId' },
        })
        .then(recipes => res.status(200).json(recipes))
        .catch(next);
}

function getRecipesByCategory(req, res, next) {
    const { category } = req.query;

    recipeModel
        .find({ category })
        .populate('userId')
        .populate({
            path: 'comments',
            populate: { path: 'userId' },
        })
        .then(recipes => res.status(200).json(recipes))
        .catch(next);
}

function getRecipeById(req, res, next) {
    const { recipeId } = req.params;

    recipeModel
        .findById(recipeId)
        .populate('userId')
        .populate({
            path: 'comments',
            populate: { path: 'userId' },
        })
        .then(recipe => {
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found!' });
            }
            res.status(200).json(recipe);
        })
        .catch(next);
}

function createRecipe(req, res, next) {
    const { name, category, ingredients, instructions, imageUrl } = req.body;
    const { _id: userId } = req.user;

    recipeModel
        .create({ name, category, ingredients, instructions, imageUrl, userId })
        .then(recipe => {
            return userModel
                .updateOne({ _id: userId }, { $push: { recipes: recipe._id } })
                .then(() => recipeModel.findById(recipe._id).populate('userId'))
                .then(populatedRecipe => res.status(200).json(populatedRecipe));
        })
        .catch(next);
}

function editRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;
    const { name, category, ingredients, instructions, imageUrl } = req.body;

    recipeModel
        .findOneAndUpdate(
            { _id: recipeId, userId },
            { name, category, ingredients, instructions, imageUrl },
            { new: true, runValidators: true },
        )
        .populate('userId')
        .populate({
            path: 'comments',
            populate: { path: 'userId' },
        })
        .then(updatedRecipe => {
            if (updatedRecipe) {
                res.status(200).json(updatedRecipe);
            } else {
                res.status(403).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

function deleteRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;

    recipeModel
        .findOneAndDelete({ _id: recipeId, userId })
        .then(deletedRecipe => {
            if (!deletedRecipe) {
                return res.status(403).json({ message: 'Not allowed!' });
            }
            return Promise.all([
                userModel.updateOne(
                    { _id: userId },
                    { $pull: { recipes: recipeId } },
                ),
                commentModel.deleteMany({ recipeId }),
                userModel.updateMany(
                    { comments: { $in: deletedRecipe.comments } },
                    { $pull: { comments: { $in: deletedRecipe.comments } } },
                ),
                userModel.updateMany(
                    { favorites: recipeId },
                    { $pull: { favorites: recipeId } },
                ),
            ]).then(() => res.status(200).json(deletedRecipe));
        })
        .catch(next);
}

async function toggleFavorite(req, res, next) {
    const { recipeId } = req.params;
    const userId = req.user._id;

    try {
        const recipe = await recipeModel.findById(recipeId);
        if (!recipe)
            return res.status(404).json({ message: 'Recipe not found' });

        const isFavorited = recipe.favorites.includes(userId);
        const update = isFavorited
            ? { $pull: { favorites: userId } }
            : { $addToSet: { favorites: userId } };

        const updatedRecipe = await recipeModel
            .findByIdAndUpdate(recipeId, update, { new: true })
            .populate('userId', 'username email')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'username email' },
            });

        res.status(200).json(updatedRecipe);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllRecipes,
    getLatestRecipes,
    getRecipesByCategory,
    getRecipeById,
    createRecipe,
    editRecipe,
    deleteRecipe,
    toggleFavorite,
};
