//root/router/test.js

const express = require('express');
const router = express.Router();

const data = {
    name: 'rest-api',
    version: '1.0.0',
    description: 'REST-api for Taste of Bulgaria Angular app',
    main: 'index.js',
};

router.get('/', function (req, res) {
    res.send(data);
});

module.exports = router;
