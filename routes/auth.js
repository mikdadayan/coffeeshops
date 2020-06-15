const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator/check')

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/signup', authController.getSignup);

router.post(
    '/signup',[ 
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('Email exists already, please pick a different one.')
                }
                return true;
            })
        }),
    body('password', 'Please enter a password with min 8 characters.')
        .isLength({min: 8}),
    body('confirmPass')
        .custom((value, {req})=>{
            if(value !== req.body.password)
                throw new Error('Passwords have to match');
            return true
        } )
    ],
    authController.postSignup
);

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
