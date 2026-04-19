//root/controllers/commentController.js
const { userModel, recipeModel, commentModel } = require('../models');

function newComment(text, userId, recipeId) {
    return commentModel.create({ text, userId, recipeId }).then(comment => {
        return Promise.all([
            userModel.updateOne(
                { _id: userId },
                { $push: { comments: comment._id } },
            ),
            recipeModel.findByIdAndUpdate(
                { _id: recipeId },
                { $push: { comments: comment._id } },
                { new: true },
            ),
        ]);
    });
}

function getLatestComments(req, res, next) {
    const limit = Number(req.query.limit) || 20;

    commentModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('recipeId userId')
        .then(comments => {
            res.status(200).json(comments);
        })
        .catch(next);
}

function createComment(req, res, next) {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;
    const { commentText } = req.body;

    commentModel
        .create({ text: commentText, userId, recipeId })
        .then(comment => {
            return Promise.all([
                userModel.updateOne(
                    { _id: userId },
                    { $push: { comments: comment._id } },
                ),
                recipeModel.findByIdAndUpdate(recipeId, {
                    $push: { comments: comment._id },
                }),
            ]).then(() => {
                res.status(200).json(comment);
            });
        })
        .catch(next);
}

function editComment(req, res, next) {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const { _id: userId } = req.user;

    commentModel
        .findOneAndUpdate(
            { _id: commentId, userId },
            { text: commentText },
            { new: true },
        )
        .then(updatedComment => {
            if (updatedComment) {
                res.status(200).json(updatedComment);
            } else {
                res.status(403).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

function deleteComment(req, res, next) {
    const { commentId, recipeId } = req.params;
    const { _id: userId } = req.user;

    commentModel
        .findOneAndDelete({ _id: commentId, userId })
        .then(deletedOne => {
            if (!deletedOne) {
                return res.status(403).json({ message: 'Not allowed!' });
            }
            return Promise.all([
                userModel.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { comments: commentId } },
                ),
                recipeModel.findOneAndUpdate(
                    { _id: recipeId },
                    { $pull: { comments: commentId } },
                ),
            ]).then(() => res.status(200).json(deletedOne));
        })
        .catch(next);
}

function likeComment(req, res, next) {
    const { commentId } = req.params;
    const { _id: userId } = req.user;

    commentModel
        .findById(commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found!' });
            }

            if (comment.userId.toString() === userId.toString()) {
                return res
                    .status(403)
                    .json({ message: 'You cannot like your own comment!' });
            }

            const alreadyLiked = comment.likes.includes(userId.toString());
            const update = alreadyLiked
                ? { $pull: { likes: userId } }
                : { $addToSet: { likes: userId } };

            return commentModel
                .findByIdAndUpdate(commentId, update, { new: true })
                .then(updatedComment => res.status(200).json(updatedComment));
        })
        .catch(next);
}

module.exports = {
    getLatestComments,
    newComment,
    createComment,
    editComment,
    deleteComment,
    likeComment,
};
