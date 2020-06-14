const mongoose = require('mongoose');

const Shop = require("../models/shop.js");
const User = require('../models/user');


exports.getAddShop = (req, res, next) => {
    res.render('./admin/add-shop', {
        pageTitle: 'Add Shop'
    })
}


exports.postAddShop = (req, res, next) => {
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const address = req.body.address;
    const phone = req.body.phone;
    const description = req.body.description;
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
            if(shop.userId !== req.user._id){
                return res.redirect('/shops/' + shopId)
            }
            res.render('./admin/edit-shop', {
                shop: shop,
                pageTitle: 'Edit Page'
            });
        })
}


exports.postEditShop = (req, res, next) => {
    const shopId = req.body.shopId;
    const updatedName = req.body.name;
    const updatedImageUrl = req.body.imageUrl;
    const updatedAddress = req.body.address;
    const updatedPhone = req.body.phone;
    const updatedDescription = req.body.description;
    Shop.findById(shopId)
        .then(shop => {
            if(shop.userId !== req.user._id){
                return res.redirect('/shops/' + shopId)
            }
            console.log(shop)
            shop.name = updatedName;
            shop.imageUrl = updatedImageUrl;
            shop.address = updatedAddress;
            shop.phone = updatedPhone;
            shop.description = updatedDescription;
            return shop.save()
            .then(result => {
                console.log('Shop Updated');
                res.redirect('/shops/' + shopId);
            })
        })
        .catch(err => {
            console.log(err);
        })
}


exports.postDeleteShop = (req, res, next) => {
    const shopId = req.body.shopId;
    Shop.deleteOne({_id: shopId, userId: req.user._id})
    .then(result => {
        // console.log(result);
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    })
}