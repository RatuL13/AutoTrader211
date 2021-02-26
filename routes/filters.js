var express=require("express");
var router=express.Router();
var Car=require("../models/car");
var Comment=require("../models/comment");
var User=require("../models/user");
var Review=require("../models/review");
var middleware=require("../middleware/index.js");
router.get("/filter",function(req,res){
   res.render("filters/MoreFilter");
});
module.exports=router;