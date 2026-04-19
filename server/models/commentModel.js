//root/models/commentModel.js

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        userId: {
            type: ObjectId,
            ref: 'User',
        },
        recipeId: {
            type: ObjectId,
            ref: 'Recipe',
        },
        likes: [
            {
                type: ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Comment', commentSchema);
