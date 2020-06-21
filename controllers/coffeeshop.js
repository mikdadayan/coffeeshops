const Shop = require("../models/shop.js");
const Comment = require('../models/comment');

exports.getShops = (req, res, next) => {
    Shop.find()
    .then(shops => {
        res.status(200).render("./shop/coffeeshops", {
            pageTitle: 'CoffeeShop',
            shops: shops
        });
    })
}

exports.getShop = (req, res, next) => {
    const shopId = req.params.shopId;
    let userId;
    let shopOwn;
    Shop.findById(shopId)
        .populate('comments')
        .exec()
        .then(shop => {
            if(req.user){
                shopOwn = (shop.user.userId.toString() == req.user._id.toString()) ? true : false;
                userId = req.user._id
            }
            console.log(shop.comments)
            res.render('./shop/coffeshop', {
                shop: shop,
                pageTitle: shop.name,
                comments: shop.comments,
                shopOwn: shopOwn,
                userId : userId
            });
        }).
        catch(err => {
            console.log(err);
        })
    
}


exports.getAddComment = (req, res, next) => {
    const shopId = req.params.shopId;
    res.render('./shop/add-comment', {
        pageTitle: 'Add Comment',
        shopId: shopId 
    });
}


exports.postAddComment = (req, res, next) => {
    const shopId = req.body.shopId;
    const newComment = req.body.comment;
    console.log(req.user._id)
    console.log(req.user.email)
    const comment = new Comment({
        text: newComment,
        user: {
            userId: req.user._id,
            email: req.user.email
        }
    })
    return comment.save().then(comment => {
        Shop.findById(shopId)
            .then(shop => {
                shop.comments.push(comment);
                return shop.save()
            })
    })
    .then( result => {
        res.redirect('/shops/' + shopId)
    })
}


exports.getEditComment = (req, res, next) => {
    const commentId = req.params.commentId;
    const shopId = req.params.shopId;
    Comment.findById(commentId)
        .then(comment => {
            if(comment.user.userId.toString() !== req.user._id.toString()){
                return res.redirect('/shops/' + shopId)
            }
            res.render('./shop/edit-comment', {
                pageTitle: 'Edit Comment',
                comment: comment,
                shopId: shopId
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditComment = (req, res, next) => {
   const commentId = req.body.commentId; 
   const shopId = req.body.shopId;
   const updatedText = req.body.comment;
   Comment.findById(commentId)
    .then( comment => {
        console.log("^^^^^^^^^^^^")
        if(comment.user.userId.toString() !== req.user._id.toString()){
            return res.redirect('/shops/' + shopId)
        }
        comment.text = updatedText;
        return comment.save()
        .then(result => {
            res.redirect('/shops/' + shopId)
        })
    })
    // Wrong code !!!!!
    // .then(comment => {
    //     return Shop.findById(shopId)
    //         .then(shop => {
    //             shop.comments.push(comment);
    //             console.log()
    //             return shop.save()
    //         })
    // })
   
    .catch(err => console.log(err))
}

exports.postDeleteComment = (req, res, next) => {
    const commentId = req.body.commentId;
    const shopId = req.body.shopId;
    Comment.deleteOne({_id: commentId, 'user.userId': req.user._id})
    .then(result => {
        // console.log(result);
        res.redirect('/shops/' + shopId);
    })
    .catch(err => {
        console.log(err);
    })

}