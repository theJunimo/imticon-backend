const express = require('express');
const router = express.Router();
const { Emoticon, Tag } = require('../models');

router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Express' });
});

module.exports = router;
