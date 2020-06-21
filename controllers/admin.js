const mongoose = require('mongoose');
const fs = require('fs')

const Shop = require("../models/shop.js");
const User = require('../models/user');


exports.getAddShop = (req, res, next) => {
    res.render('./admin/add-shop', {
        pageTitle: 'Add Shop',
        shop: {
            name: '',
            address: '',
            description: '',
            phone: ''
        },
        errorMessage: '',
        validationErrs: []
    })
}


exports.postAddShop = (req, res, next) => {
    const name = req.body.name;
    // const imageUrl = req.body.imageUrl;
    const address = req.body.address;
    const phone = req.body.phone;
    const description = req.body.description;
    const image = req.file;
    const imageUrl = image.path.replace('\\','/');
    console.log(imageUrl);
    if(!image){
        return res.status(422).render('./admin/add-shop', {
            pageTitle: 'Add Shop',
            shop: {
                name: name,
                address: address,
                description: description,
                phone: phone
            },
            errorMessage: 'Attached File isnot an image.',
            validationErrs: [{param: 'imageUrl'}]
        }) 
    }
    const shop = new Shop({
        name: name,
        imageUrl: imageUrl, 
        address: address,
        phone: phone,
        description: description,
        user:{
            userId: req.user,
            email: req.user.email
        }
        
    })
    shop.save()
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(err => {
            console.log(err);
        })
}


exports.getEditShop = (req, res, next) => {
    const shopId = req.params.shopId;
    Shop.findById(shopId)
        .then(shop => {
            if(shop.user.userId.toString() !== req.user._id.toString()){
                return res.redirect('/shops/' + shopId)
            }
            res.render('./admin/edit-shop', {
                pageTitle: 'Edit Shop',
                shop: shop,
                errorMessage: '',
                validationErrs: []
            });
        })
        // .catch(err => {
        //     console.log(err)
        //     // err.status = 500
        //     // next(err)
        // })
}


exports.postEditShop = (req, res, next) => {
    const shopId = req.body.shopId;
    const updatedName = req.body.name;
    const updatedAddress = req.body.address;
    const updatedPhone = req.body.phone;
    const updatedDescription = req.body.description;
    const image = req.file;
    console.log(shopId)

    Shop.findById(shopId)
        .then(shop => {
            if(shop.user.userId.toString() !== req.user._id.toString()){
                return res.redirect('/shops/' + shopId)
            }
            shop.name = updatedName;
            shop.address = updatedAddress;
            shop.phone = updatedPhone;
            shop.description = updatedDescription;
            if(image){
                fs.unlink(shop.imageUrl, ()=> {
                    console.log('deleted')
                })
                shop.imageUrl = image.path;
                
            }
            return shop.save()
            .then(result => {
                res.redirect('/shops/' + shopId);
            })
        })
        .catch(err => {
            console.log(err);
        })
}


exports.postDeleteShop = (req, res, next) => {
    const shopId = req.body.shopId;
    console.log(req.user._id)
    Shop.deleteOne({_id: shopId,  'user.userId': req.user._id}) 
        .then(result => {
            console.log(shopId)
            console.log("%%%%%%%%%%%%%%");
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
}