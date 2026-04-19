//root/controllers/recipeController.js

const { recipeModel, userModel, commentModel } = require('../models');

function getAllRecipes(req, res, next) {
    recipeModel
        .find()
        .populate('userId')
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
        .then(recipes => res.status(200).json(recipes))
        .catch(next);
}

function getRecipesByCategory(req, res, next) {
    const { category } = req.query;

    recipeModel
        .find({ category })
        .populate('userId')
        .then(recipes => res.status(200).json(recipes))
        .catch(next);
}

function getRecipeById(req, res, next) {
    const { recipeId } = req.params;

    recipeModel
        .findById(recipeId)
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
                .then(() => res.status(200).json(recipe));
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

function toggleFavorite(req, res, next) {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;

    recipeModel
        .findById(recipeId)
        .then(recipe => {
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found!' });
            }
            if (recipe.userId.toString() === userId.toString()) {
                return res.status(403).json({ message: 'Not allowed!' });
            }

            const alreadyFavorited = recipe.favorites.some(
                id => id.toString() === userId.toString(),
            );
            const update = alreadyFavorited
                ? { $pull: { favorites: userId } }
                : { $addToSet: { favorites: userId } };

            return recipeModel
                .findByIdAndUpdate(recipeId, update, { new: true })
                .then(updatedRecipe => res.status(200).json(updatedRecipe));
        })
        .catch(next);
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
