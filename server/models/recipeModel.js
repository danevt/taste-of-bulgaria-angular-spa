//root/models/recipeModel.js

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const recipeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Main Dishes', 'Salads & Appetizers', 'Desserts'],
            required: true,
        },
        ingredients: [
            {
                type: String,
                required: true,
            },
        ],
        instructions: [
            {
                type: String,
                required: true,
            },
        ],
        imageUrl: {
            type: String,
            required: true,
        },
        userId: {
            type: ObjectId,
            ref: 'User',
        },
        comments: [
            {
                type: ObjectId,
                ref: 'Comment',
            },
        ],
        favorites: [
            {
                type: ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Recipe', recipeSchema);
