const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check } = require('express-validator');

// const upload_img = multer({ dest: 'images/' });
// const upload_menu = multer({ dest: 'images/menu' });

const filestorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname);
	},
});

const filestorage_menu = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images/menu');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname);
	},
});


const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
// cpUpload = upload.fields([
// 	{ name: 'avatar', maxCount: 1 },
// 	{ name: 'gallery', maxCount: 8 },
// ]);

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth');

router.get('/admin/add-shop', isAuth, adminController.getAddShop);

router.post(
	'/admin/add-shop',
    isAuth, 
    multer({ storage: filestorage, fileFilter: fileFilter }).single('image'),
	// multer({ storage: filestorage_menu, fileFilter: fileFilter }).single('menu'),
	adminController.postAddShop
);

router.get('/admin/edit-shop/:shopId', isAuth, adminController.getEditShop);

router.post(
	'/admin/edit-shop',
	isAuth,
	multer({ storage: filestorage, fileFilter: fileFilter }).single('image'),
	adminController.postEditShop
);

router.post('/admin/delete-shop', isAuth, adminController.postDeleteShop);

module.exports = router;
