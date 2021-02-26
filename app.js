if(process.env.NODE_ENV!=="production"){
require("dotenv").config();
}
var express=require("express");
var app=express();
var port=process.env.PORT || 3000;
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var flash=require("connect-flash");  
var methodOverride=require("method-override");
var session=require("express-session");
var validator=require("express-validator");
var MongoStore=require("connect-mongo")(session);
var cookieParser = require('cookie-parser');
//var csrf=require("csurf");
//var csrfProtection=csrf();
var Car= require("./models/car");
var User=require("./models/user");
var Cart=require("./models/cart");
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
   
   var commentRoutes         = require("./routes/comments"),
    reviewRoutes          = require("./routes/reviews"),
    carsRoutes     = require("./routes/cars"),
    indexRoutes           = require("./routes/index"),
    filterRotes     =require("./routes/filters");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Ratul is awesome!!",
    resave: false,
    saveUninitialized: false
 }))
 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
  /* if(req.user){
      User.findById(req.user._id).populate('notifications',null, {isRead: false }).exec(function(err,user){
        if(err){
            console.log(err.message);
        }
        else
        res.locals.notifications = user.notifications.reverse();
      });
    }*/
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});


app.use(indexRoutes);
app.use("/cars",carsRoutes);
app.use("/filters",filterRotes);

app.listen(port,function(){
    console.log("Auto Trader Server has started!!");
   });


/*app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//app.use(csrf({cookie: true}));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(session({
    secret: "Ratul is awesome!!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180*60*1000}
 }))
 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   res.localslogin==req.isAuthenticated();
   res.locals.session=req.session;
   next();
});

app.get("/",function(req,res){
  res.render("home");
});

// SIGN UP
app.get("/user/signup",function(req,res,next){
res.render("user/signup");
});
//POST OF SIGN UP
app.post("/user/signup",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var email=req.body.email;
    var newUser= new User({
        username: username,
        password:password,
        email:email
        });
    User.register(newUser,password,function(err,user){
        if(err)
                {
                  req.flash("error",err.message);  
                  res.redirect("/user/signup");
                 }
                 else{
                     passport.authenticate("local")(req,res,function(){
                      req.flash("success","Welcome to Auto Trader! "+" "+user.username);   
                      res.redirect("/");
   
                     });
                   }
         });
});

//LOGIN ROUTES
    app.get("/user/signin",function(req,res){
        res.render("user/signin");
      });
      //LOGIN LOGIC
      //MIDDLEWARE
    app.post("/user/signin",passport.authenticate("local",{
             successRedirect:"/",
             failureRedirect:"/user/signin",
             successFlash: "Welcome to Auto Trader!"
      }),function(req,res){   
      
    });
    app.get("/logout",function(req,res){
           req.logout();
           req.flash("success","Logged you Out!")
           res.redirect("/");
      });
    //ADD TO CART
    app.get("/add-to-cart/:id",function(req,res){
      var productID=req.params.id;
      var cart=new Cart(req.session.cart ? req.session.cart : {items:{}});
      Cloth.findById(productID,function(err,cloth){
        if(err)
        {
          req.flash("error",err.message);  
                  res.redirect("/");
        }
        else
        {
          cart.add(cloth,cloth.id);
          req.session.cart=cart;
          console.log(req.session.cart);
          res.redirect("/");
        }
      });
    });

// SHOPPING CART
app.get("/shopping-cart",function(req,res,next){
if(!req.session.cart)
return res.render("cloth/shopping-cart",{products: null});
var cart=new Cart(req.session.cart);
res.render("cloth/shopping-cart",{products: cart.generateArray(), totalPrice: cart.totalPrice});
});
//CHECKOUT
app.get("/checkout",function(req,res,next){
  if(!req.session.cart)
  return res.redirect("/shopping-cart");
  var cart=new Cart(req.session.cart);
  var errMsg=req.flash("error")[0];
  res.render("cloth/checkout",{totalPrice: cart.totalPrice, errMsg:errMsg, noError: !errMsg});

});
app.post("/checkout",function(req,res,next){
  
  if(!req.session.cart)
  return res.redirect("/shopping-cart");

  var cart=new Cart(req.session.cart);
  var stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create({
    amount: cart.totalPrice*100,
    currency: 'usd',
    source: "tok_mastercard",
    description: 'Test Charge',
  }, function(err,charge){
     if(err)
     {
       req.flash("error",err.message);
       return res.redirect("/checkout");
     }
     else
     {
       req.flash("success","Successfully bought the item!");
       req.cart=null;
       res.redirect("/");
     }
  });
});
app.listen(port,function(){
    console.log("AutoTrader Server has started!!");
});*/