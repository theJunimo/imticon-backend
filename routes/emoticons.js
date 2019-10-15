const express = require('express');
const router = express.Router();
const { Emoticon, Tag } = require('../models');
const Sequelize = require('sequelize');

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

/*모든 이모티콘 불러오기*/
router.get('/', wrap(async(req, res, next) => {
    const emtiResult = await Emoticon.findAll({order: [['copyCount', 'DESC'], ['createdAt', 'DESC']]});
    const tagResult = await Promise.all(emtiResult.map((el) => el.getTags()));
  
    const list = [];
  
    emtiResult.map((el, idx) => {
      list.push({
        id: el.id,
        emoticon: el.text,
        tag: tagResult[idx].map((el) => el.name)
      })
    })
    
    const data = {
      list
    }
    return res.status(200).send(data);
  }));


/* db에 새로운 이모티콘 등록 */
router.post('/', wrap(async (req, res, next)  => {
    const { emoticon, tag } = req.body;
  
    let exEmti = await Emoticon.findOne({where: { text: emoticon }});
  
    if(!exEmti) {
      const emtiResult = await Emoticon.create({text: emoticon});
      const tagResult = await Promise.all(tag.map((el) => Tag.findOrCreate({
        where: { name: el }
      })));

      await emtiResult.addTags(tagResult.map(tr => tr[0]));
      const tags = await emtiResult.getTags();

      const data = {
        status: 'new',
        list : [{
          id: emtiResult.id,
          emoticon: emtiResult.text,
          tag: tags.map((el) => el.name)
        }]
      }

      return res.status(200).send(data);

    } else {
      const tags = await exEmti.getTags();
      const data = {
        status: 'already exist',
        list: [{
            id: exEmti.id,
            emoticon: exEmti.text,
            tag: tags.map((el) => el.name)
          }]
      }

      return res.status(200).send(data);
    }
  
  }));


//유저가 copy할 때마다 count수 올리기
//인기순으로 emoticon을 정렬하기 위해 필요함
router.post('/:id', wrap(async(req, res, next) => {
    const { id } = req.params;

    await Emoticon.update({
        copyCount: Sequelize.literal('copyCount + 1')
    }, {
        where: { id }
    });

    return res.status(200).send('완료');
}))

module.exports = router;
