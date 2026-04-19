//root/utils/auth.js

const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const { userModel, tokenBlacklistModel } = require('../models');

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        const token = req.cookies[authCookieName] || '';

        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token }),
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    const err = new Error('blacklisted token');
                    err.status = 401;
                    throw err;
                }
                return userModel.findById(data.id);
            })
            .then(user => {
                if (!user) {
                    const err = new Error('Invalid token!');
                    err.status = 401;
                    throw err;
                }
                req.user = user;
                req.isLogged = true;
                next();
            })
            .catch(err => {
                if (!redirectUnauthenticated) {
                    return next();
                }

                const authErrorMessages = [
                    'token expired',
                    'blacklisted token',
                    'jwt must be provided',
                    'jwt malformed',
                    'Invalid token!',
                ];

                if (
                    authErrorMessages.includes(err.message) ||
                    err.name === 'JsonWebTokenError'
                ) {
                    err.status = 401;
                    err.message = 'Invalid token!';
                }

                next(err);
            });
    };
}

module.exports = auth;
