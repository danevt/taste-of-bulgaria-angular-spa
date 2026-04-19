//root/controllers/auth.js

const { userModel, tokenBlacklistModel } = require('../models');

const utils = require('../utils');
const { authCookieName } = require('../app-config');

const bsonToJson = data => {
    return JSON.parse(JSON.stringify(data));
};
const removePassword = data => {
    const { password, __v, ...userData } = data;
    return userData;
};

function register(req, res, next) {
    const { email, username, password } = req.body;

    return userModel
        .create({ email, username, password })
        .then(createdUser => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            const token = utils.jwt.createToken({ id: createdUser._id });
            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
            } else {
                res.cookie(authCookieName, token, { httpOnly: true });
            }
            res.status(200).send(createdUser);
        })

        .catch(err => {
            if (err.code === 11000) {
                return res.status(409).json({
                    message: 'Email or username is already registered!',
                });
            }
            next(err);
        });
}

function login(req, res, next) {
    const { email, password } = req.body;

    userModel
        .findOne({ email })
        .then(user => {
            if (!user) {
                return res
                    .status(401)
                    .send({ message: 'Wrong email or password' });
            }
            return user.matchPassword(password).then(match => {
                if (!match) {
                    return res
                        .status(401)
                        .send({ message: 'Wrong email or password' });
                }
                user = bsonToJson(user);
                user = removePassword(user);

                const token = utils.jwt.createToken({ id: user._id });

                if (process.env.NODE_ENV === 'production') {
                    res.cookie(authCookieName, token, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                    });
                } else {
                    res.cookie(authCookieName, token, { httpOnly: true });
                }
                res.status(200).send(user);
            });
        })
        .catch(next);
}

function logout(req, res, next) {
    const token = req.cookies[authCookieName];

    if (!token) {
        return res.status(204).end();
    }

    tokenBlacklistModel
        .create({ token })
        .then(() => {
            res.clearCookie(authCookieName).status(204).end();
        })
        .catch(next);
}

function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    userModel
        .findOne({ _id: userId }, { password: 0, __v: 0 })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(next);
}

function editProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    const { username, email } = req.body;

    userModel
        .findOneAndUpdate(
            { _id: userId },
            { username, email },
            { runValidators: true, new: true },
        )
        .then(x => {
            res.status(200).json(x);
        })
        .catch(next);
}

module.exports = {
    login,
    register,
    logout,
    getProfileInfo,
    editProfileInfo,
};
