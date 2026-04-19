//root/utils/errHandler.js

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    const status = err.status || 500;

    let message = err.message || 'Something went wrong!';

    if (status === 403) {
        message = 'ErrorHandler: not allowed!';
    }

    console.error(`[Error Handler]: ${status} - ${message}`);
    if (status === 500) {
        console.error(err.stack);
    }

    res.status(status).json({ message });
}

module.exports = errorHandler;
