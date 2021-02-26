var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var Schema=mongoose.Schema;

var user=new Schema({
  username:{type:String, unique:true,required:true},
   password:String,
   isAdmin: {type: Boolean,
             default: false 
            },
   profileimage: String,
   profileimageid: String,
   email: {type:String, unique:true, required: true},
   resetPasswordToken: String,
   resetPasswordExpires: Date
});
user.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",user);