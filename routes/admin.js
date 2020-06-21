const express = require('express');
const router = express.Router();
const multer = require('multer');
const {check} = require('express-validator/check/index');


const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb)=> {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb( null, true )
    } else {
        cb( null, false )
    }
}

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth')

router.get('/admin/add-shop', isAuth, adminController.getAddShop);

router.post('/admin/add-shop',  isAuth, multer({storage: filestorage, fileFilter: fileFilter}).single('image'), adminController.postAddShop);

router.get('/admin/edit-shop/:shopId', isAuth,  adminController.getEditShop);

router.post('/admin/edit-shop', isAuth, multer({storage: filestorage, fileFilter: fileFilter}).single('image'), adminController.postEditShop);

router.post('/admin/delete-shop', isAuth, adminController.postDeleteShop);

module.exports  = router;