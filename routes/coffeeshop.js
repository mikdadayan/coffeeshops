const express = require('express');
const router = express.Router();

const coffeeshopController = require('../controllers/coffeeshop');
const isAuth = require('../middlewares/isAuth')

//
router.get('/', coffeeshopController.getShops);

router.get('/shops', coffeeshopController.getShops);

router.get('/shops/:shopId', coffeeshopController.getShop);

router.get('/shops/:shopId/comments/add-comment', isAuth, coffeeshopController.getAddComment);

router.post('/shops/comments/add-comment', isAuth, coffeeshopController.postAddComment);

router.get('/shops/:shopId/comments/edit-comment/:commentId',  isAuth, coffeeshopController.getEditComment);

router.post('/shops/comments/edit-comment', isAuth,coffeeshopController.postEditComment);

router.post('/shops/comments/delete-comment', isAuth, coffeeshopController.postDeleteComment);




module.exports = router;