//ALL MIDDLEWARE
var middlewareObj={};
var Comment=require("../models/comment");
var Car=require("../models/car");
var Review = require("../models/review");

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
    return next();
    else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("/user/signin");
    }
}
middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,comment){
                Comment.findById(req.params.comment_id,function(err,foundComment){
                    if(err)
                    console.log(err);
                    else{
                        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin)
                    return next();
                    else{
                        req.flash("error","You do not have permission to do that");        
                        res.redirect("back")
                    }  
                  }
                });    
         });
        }
         else
         req.flash("error","You need to be logged in to do that");
      
}
middlewareObj.checkCarOwnership=function(req,res,next){
    if(req.isAuthenticated()){
                Car.findById(req.params.id,function(err,foundCar){
                    if(err)
                    req.flash("error","Car not found");
                    else{
                        if(foundCar.author.id.equals(req.user._id)|| req.user.isAdmin)
                    return next();
                    else{
                        req.flash("error","You do not have permission to do that");        
                        res.redirect("back")
                    }    
                }
                });    
        }
         else{
         req.flash("error","You need to be logged in to do that");
         res.redirect("back");
         }
}

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Car.findById(req.params.id).populate("reviews").exec(function (err, foundCar) {
            if (err || !foundCar) {
                req.flash("error", "Car not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundHotel.reviews
                var foundUserReview = foundCar.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/cars/" + foundCar._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

module.exports=middlewareObj;