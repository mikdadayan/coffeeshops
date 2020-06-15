const express = require('express');
const router = express.Router();
const {check} = require('express-validator')

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth')

router.get('/admin/add-shop', isAuth, adminController.getAddShop);

router.post('/admin/add-shop', isAuth, adminController.postAddShop);

router.get('/admin/edit-shop/:shopId',  adminController.getEditShop);

router.post('/admin/edit-shop', isAuth, adminController.postEditShop);

router.post('/admin/delete-shop', isAuth, adminController.postDeleteShop);

module.exports  = router;