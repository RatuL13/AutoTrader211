var express=require("express");
var router=express.Router();
var Car=require("../models/car");
var Comment=require("../models/comment");
var User=require("../models/user");
var Review=require("../models/review");
var middleware=require("../middleware/index.js");
var request=require("request");
const url =require("url");

var cloudinary=require("../Cloudinary/index.js");

//IMAGE UPLOAD
const multer = require('multer');
const{storage}=require("../Cloudinary/index");
const upload = multer({storage});
/*var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});*/

router.get("/",function(req,res){
    var noMatch=null;
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
   if(req.query.search){
    const regex=new RegExp(escapeRegex(req.query.search),"gi");
        Car.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allCars){
            Car.count().exec(function (err, count) {
            if(err){
                console.log(err);
            } 
            else{
                if(allCars.length<1)
                noMatch="No cars match that query, please try again";
                res.render("car/index",{cars:allCars,noMatch:noMatch,current:pageNumber,
                    pages: Math.ceil(count / perPage)});
            }
        });
        });
   }
   else{
     Car.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, all_cars) {
        Car.count().exec(function (err, count) {
        if(err)
        console.log(err);
        else
        {
        res.render("car/index",{cars:all_cars,currentUser:req.user,noMatch:noMatch,current: pageNumber,
            pages: Math.ceil(count / perPage)});
        }
        });

    });
}
});
// FOR POSTCODE
router.post("/searchFilter",function(req,res){
    var noMatch=null;
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var dist=parseInt(req.body.distances,10);
    var minPri=parseInt(req.body.minPrice,10);
    var maxPri=parseInt(req.body.maxPrice,10);
    var pageNumber = pageQuery ? pageQuery : 1;
   if(req.body.postcode!=="")
   var filterPara={postcode: req.body.postcode};
   else if(req.body.make!=="")
   var filterPara={name: req.body.make};
   else if(req.body.distances!=="")
   var filterPara={distance: { $lte: dist}};
   else if(req.body.maxPrice!==""&&req.body.maxPrice!=="Max price(any)")
   var filterPara={price: { $lte: maxPri}};
   else if(req.body.minPrice!==""&&req.body.minPrice!=="Min price(any)")
   var filterPara={ price: { $gte: minPri}};
   var carFilter=Car.find(filterPara);
   carFilter.skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCars) {
        carFilter.count().exec(function (err, count) {
        if(err)
        console.log(err);
        else
        {
            console.log(req.body);
            if(allCars.length<1)
            noMatch="No cars match that query, please try again";
           res.render("car/index",{cars:allCars,currentUser:req.user,noMatch:noMatch,current: pageNumber,
            pages: Math.ceil(count / perPage)});
        }
        });
   });

});
// FOR MAKE MODEL
router.post("/make",function(req,res){
    var noMatch=null;
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    console.log(req.body.make);
    if(req.body.make!=="undefined")
    {
        Car.find({name: req.body.make}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allCars){
            Car.count().exec(function (err, count) {
            if(err){
                console.log(err);
            } 
            else{
                if(allCars.length<1)
                noMatch="No cars match that query, please try again";
                res.render("car/index",{cars:allCars,noMatch:noMatch,current:pageNumber,
                    pages: Math.ceil(count / perPage)});
            }
        });
        });
    }
    else
    {
     Car.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, all_cars) {
        Car.count().exec(function (err, count) {
        if(err)
        console.log(err);
        else
        {
        res.render("car/index",{cars:all_cars,currentUser:req.user,noMatch:noMatch,current: pageNumber,
            pages: Math.ceil(count / perPage)});
        }
        });

    });
}
});
// FOR 1 MILE MODEL
router.post("/distances",function(req,res){
    var noMatch=null;
    var perPage = 8;
    var n=parseInt(req.body.distances,10);
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.body.distances!=="undefined")
    {
        Car.find({ distance: { $lte: n}}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allCars){
            Car.count().exec(function (err, count) {
            if(err){
                console.log(err);
            } 
            else{
                if(allCars.length<1)
                noMatch="No cars match that query, please try again";
                res.render("car/index",{cars:allCars,noMatch:noMatch,current:pageNumber,
                    pages: Math.ceil(count / perPage)});
            }
        });
        });
    }
    else
    {
     Car.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, all_cars) {
        Car.count().exec(function (err, count) {
        if(err)
        console.log(err);
        else
        {
        res.render("car/index",{cars:all_cars,currentUser:req.user,noMatch:noMatch,current: pageNumber,
            pages: Math.ceil(count / perPage)});
        }
        });

    });
}
});
// FOR MINIMUM PRICE
router.post("/minP",function(req,res){
    var noMatch=null;
    var perPage = 8;
    var n=parseInt(req.body.minPrice,10);
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.body.minPrice!=="undefined")
    {
        Car.find({ price: { $gte: n}}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allCars){
            Car.count().exec(function (err, count) {
            if(err){
                console.log(err);
            } 
            else{
                if(allCars.length<1)
                noMatch="No cars match that query, please try again";
                res.render("car/index",{cars:allCars,noMatch:noMatch,current:pageNumber,
                    pages: Math.ceil(count / perPage)});
            }
        });
        });
    }
    else
    {
     Car.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, all_cars) {
        Car.count().exec(function (err, count) {
        if(err)
        console.log(err);
        else
        {
        res.render("car/index",{cars:all_cars,currentUser:req.user,noMatch:noMatch,current: pageNumber,
            pages: Math.ceil(count / perPage)});
        }
        });

    });
}
});
// FOR MAXIMUM PRICE
router.post("/maxP",function(req,res){
    var noMatch=null;
    var perPage = 8;
    var n=parseInt(req.body.maxPrice,10);
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.body.maxPrice!=="undefined")
    {
        Car.find({ price: { $lte: n}}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allCars){
            Car.count().exec(function (err, count) {
            if(err){
                console.log(err);
            } 
            else{
                if(allCars.length<1)
                noMatch="No cars match that query, please try again";
                res.render("car/index",{cars:allCars,noMatch:noMatch,current:pageNumber,
                    pages: Math.ceil(count / perPage)});
            }
        });
        });
    }
    else
    {
     Car.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, all_cars) {
        Car.count().exec(function (err, count) {
        if(err)
        console.log(err);
        else
        {
        res.render("car/index",{cars:all_cars,currentUser:req.user,noMatch:noMatch,current: pageNumber,
            pages: Math.ceil(count / perPage)});
        }
        });

    });
}
});

router.post("/",middleware.isLoggedIn,upload.array("image"),function(req,res){
    /*cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
      // add cloudinary url for the image to the campground object under image property
      req.body.image = result.secure_url;
      // add image's public_id to campground object
      req.body.imageId = result.public_id;*/ 
    var name=req.body.name;
    var description=req.body.description;
    var price=req.body.price;
    var placename=req.body.placename;
    var postcode=req.body.postcode;
    var distance=req.body.distance;
    var author={
        id: req.user._id,
        username: req.user.username
    }
 Car.create({
        name:name,
        //images:req.files.map(f =>({url:f.path,filename:f.filename})),
        description:description,
        price: price,
        placename:placename,
        postcode:postcode,
        distance:distance,
        author: author
    } ,function(err,car){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{  
            car.images=req.files.map(f =>({url:f.path,filename:f.filename}));
             car.save(function(err){
                 if(err)
                 console.log(err);
             });
            User.findById(req.user._id).populate('followers').exec(function(err,user){
                if(err)
                {
                    req.flash("error", err.message);
                    res.redirect("back");
                  }
                  else{
                  /*{
               var newNotification = {
                    username: req.user.username,
                    campgroundId: campground.id
                };
                user.followers.forEach(function(follower){
                    var notification = Object.assign({},newNotification);
                   // const notification = Object.create(newNotification);
                    follower.notifications.push(notification);
                    follower.save();
                });
                
                res.redirect("/campgrounds");
            }
            });*/
           /* try {
                let campground = await Campground.create(newCampground);
                let user = await User.findById(req.user._id).populate('followers').exec();
                let newNotification = {
                  username: req.user.username,
                  campgroundId: campground.id
                }
                for(const follower of user.followers) {
                  let notification = await Notification.create(newNotification);
                  follower.notifications.push(notification);
                  follower.save();
                }

                res.redirect("/campgrounds");
            } catch(err) {
              req.flash('error', err.message);
              res.redirect('back');
            }
          */
             res.redirect("/cars");

        }
      }); 
 }
   
});
    //});
});

    router.get("/new",middleware.isLoggedIn,function(req,res){
 res.render("car/new");
});
// Shows more Info About a Particular Car
router.get("/:id",function(req,res){
    Car.findById(req.params.id).populate("comments likes").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err,Carfound){
        if(err)
        console.log(err);
        else
        {
            res.render("car/show",{car:Carfound});
        }
        /*{
        request("https://api.opencagedata.com/geocode/v1/json?q="+Hotelfound.placename+"&key=869a04d47a2e418384f106d4b7352b8c&language=en&pretty=1",function(error,response,body){
            if(!error&&res.statusCode==200){
                var parse=JSON.parse(body);
                const current_url= new URL(parse.results[0].annotations.OSM.url);
                const search_params = current_url.searchParams;
                var lon=search_params.get('mlon');
                var lat=search_params.get('mlat');
                 
                //FOR WEATHER
                request("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid=42aef709c5ed8bffbb47d570d6c09d8f",function(error,response,body){
                    if(!error&&res.statusCode==200){
                        var parses=JSON.parse(body);
                        var date = require('dateformat');
                        var now = new Date();
                        var formatted = date(now,'dS,mmmm');
                        res.render("hotels/show",{hotel:Hotelfound,lon:lon,lat:lat,result:parses,date:formatted});
                }
            });
            }  
            });
        }*/
    });
    });    
    //EDIT ROUTE
router.get("/:id/edit",middleware.checkCarOwnership,function(req,res){
                Car.findById(req.params.id,function(err,foundCar){
                    if(err)
                    req.flash("error","Car not found");
                    else
                    res.render("car/edit",{car: foundCar});
                });    
        });
           
//PUT ROUTE
router.put("/:id",middleware.checkCarOwnership,upload.array("editImages"),function(req,res){
   
    Car.findById(req.params.id, async function(err, car){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        } 
        else{
            /*if(req.file){
                try{
                    await cloudinary.v2.uploader.destroy(car.imageId);    
                    var result=await cloudinary.v2.uploader.upload(req.file.path);
                    car.imageId = result.public_id;
                    car.image = result.secure_url;
                }
                catch(err){
                   req.flash("error",err.message);
                   return res.redirect("back");
                } */
                if((req.file||req.files))
                {
                    try{
                        car.images.forEach(async function(img,i){
                        await cloudinary.uploader.destroy(img.filename);    
                        })
                       car.images=req.files.map(f =>({url:f.path,filename:f.filename}));
                    // const imgs=req.files.map(f =>({url:f.path, filename:f.filename}));
                     //car.images.push(...imgs);
                     car.save();
                    }
                    catch(err){
                        req.flash("error",err.message);
                        return res.redirect("back");
                     }
                }
             /*if(req.body.deleteImages)
                {
                    for(let filename of req.body.deleteImages)
                    await cloudinary.uploader.destroy(filename);

                    await car.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});           
                } */
            
            
            car.name = req.body.name;
            car.placename = req.body.placename;
            car.price = req.body.price;
            car.description = req.body.description;
            car.postcode=req.body.postcode;
            car.distance=req.body.distance;
            car.save();    
            req.flash("success","Successfully Updated!");
            res.redirect("/cars/"+req.params.id);
    }
    /*Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err)
        console.log(err)
        else
        res.redirect("/campgrounds/"+req.params.id);*/

    });
    
});
//Destroy Route
router.delete("/:id",middleware.checkCarOwnership,function(req,res){
    Car.findById(req.params.id,async function(err,car){
          if(err){
             req.flash("error",err.message);
             return res.redirect("back");
          }
          else{
              try{
             // await cloudinary.uploader.destroy(car.images.filename); 
              //const {id}=req.params;
              //await Car.findByIdAndDelete(id); 
              car.images.forEach(async function(img,i){
                await cloudinary.uploader.destroy(img.filename); 
              }) 
              //const {id}=req.params;
              //await Car.findByIdAndDelete(id);  
              car.remove();
              req.flash("success",car.name+" "+"deleted successfully!");
              res.redirect("/cars");
            }
              catch(err){
                req.flash("error",err.message);
                return res.redirect("back");
            
              }          
            }    
        });
});
//REVIEW ROUTE
// Reviews Index
router.get("/:id/reviews/", function (req, res) {
    Car.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, car) {
        if (err || !car) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {car: car});
    });
});
// Reviews New
router.get("/:id/reviews/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if a user already reviewed the hotel, only one review per user is allowed
    Car.findById(req.params.id, function (err, car) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {car: car});

    });
});
// Reviews Create
router.post("/:id/reviews/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    //lookup campground using ID
    Car.findById(req.params.id).populate("reviews").exec(function (err, car) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated hotel to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.car = car;
            //save review
            review.save();
            car.reviews.push(review);
            // calculate the new average review for the hotel
            car.rating = calculateAverage(car.reviews);
            //save campground
            car.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/cars/' + car._id);
        });
    });
});

// Reviews Edit
router.get("/:id/reviews/:review_id/edit", middleware.checkReviewOwnership, function (req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {car_id: req.params.id, review: foundReview});
    });
});

// Reviews Update
router.put("/:id/reviews/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Car.findById(req.params.id).populate("reviews").exec(function (err, car) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate hotel average
            car.rating = calculateAverage(car.reviews);
            //save changes
            car.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/cars/' + car._id);
        });
    });
});

// Reviews Delete
router.delete("/:id/reviews/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Car.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, car) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate campground average
            car.rating = calculateAverage(car.reviews);
            //save changes
            car.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/cars/" + req.params.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}
//LIKE ROUTE
router.post("/:id/like",function(req,res){
    Car.findById(req.params.id,function (err, foundCar) {
   if(err){
    console.log(err);
    return res.redirect("/cars");
}
var foundUserLike=foundCar.likes.some(function(like){
    return like.equals(req.user._id);
});
if (foundUserLike) {
    // user already liked, removing like
    foundCar.likes.pull(req.user._id);
} else {
    // adding the new user like
    foundCar.likes.push(req.user._id);
}

foundCar.save(function (err) {
    if (err) {
        console.log(err);
        return res.redirect("/cars");
    }
    return res.redirect("/cars/" + foundCar._id);

    }); 
});
});
//FUZZY SEARCH FUNCTION
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports=router;