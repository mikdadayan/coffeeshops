const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgirdTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(sendgirdTransport({
    auth: {
        api_key: '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'
    }
}))

const User = require('../models/user');

exports.getSignup = (req, res, next) => {
    res.status(200).render('./auth/signup', {
        pageTitle: 'Sign Up'
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log('EMail already exists!!!!!')
                return res.status(302).redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPass => {
                    const newUser = new User({
                        email: email,
                        password: hashedPass
                    });
                    return newUser.save()
                })
                .then(result => {
                    transport.sendMail({
                        to: 'mdadayan07@gmail.com',
                        from: 'CoffeeShop@shop.am',
                        subject: 'Sign Up succeeded!',
                        html: '<html>You successfuly signed up!</html>'
                    })
                    res.redirect('/login')
                })
        })
        .catch(err => {
            console.log(err)
        })
}


exports.getLogin = (req, res, next) => {
    res.render('./auth/login', {
        pageTitle: 'Login'
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log("Wrong Email or Password");
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/')
                        })
                    }
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                });
        });
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(req.session);
        res.redirect('/')
    })
}


//Passwrod Reset
exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password'
    })
}


exports.postReset = (req, res, next) => {
    crypto.randomBytes(36, (err, Buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = Buffer.toString('hex');
        User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                console.log('No Account Founded')
                return res.redirect('/reset')
            }
            user.resetToken = token;
            user.resetExpiration = Date.now() + 360000;
            return user.save().then(user => {
                res.redirect('/login')
                transport.sendMail({
                    to: user.email,
                    from: 'CoffeeShop@shop.am',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested for password reset</p>
                        <p>Clik this <a href="http://localhost:3000/reset/${token}" >link</a> to set new password</p>
                    `
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    console.log(token)
    User.findOne({resetToken: token, resetExpiration: {$gt: Date.now()}})
        .then(user=>{
            res.render('auth/new-password', {
                pageTitle: 'New Password',
                userId: user._id.toString() 
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    console.log(userId)
    const password = req.body.password;
    User.findById(userId)
    .then(user => {
        console.log(user)
        return bcrypt.hash(password, 12)
            .then(hashedPass => {
                user.password = hashedPass;
                user.resetToken = '';
                user.resetExpiration = '';
                return user.save()
            })
    })
    .then(result => {
        console.log(result);
        res.redirect('/login')
    })
    .catch(err => {
        console.log(err)
    })
}