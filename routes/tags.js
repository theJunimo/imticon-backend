const express = require('express');
const router = express.Router();
const { Emoticon, Tag } = require('../models');

const wrap = asyncFn => {
  return (async (req, res, next) => {
    try {
      return await asyncFn(req, res, next)
    } catch (error) {
      console.log(error);
      return next(error)
    }
  })  
}

/*태그로 이모티콘 검색*/
router.get('/', wrap(async (req, res, next) =>{
  const { tag } = req.query;
  
  const tagResult = await Tag.findOne({where: {name : tag}});
  if(!tagResult) return res.status(200).send({list: []});

  const emtiResult = await tagResult.getEmoticons({order: [['copyCount', 'DESC'], ['createdAt', 'DESC']]});

  const tagList = await Promise.all(emtiResult.map((el) => el.getTags()));

  const list = [];

  emtiResult.map((el, idx) => {
    list.push({
      id: el.id,
      emoticon: el.text,
      tag: tagList[idx].map((el) => el.name)
    })
  });

  const data = {
    list
  }

  return res.status(200).send(data);

}));

module.exports = router;
