var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var car=new Schema({
  /*imagePath:{type: String, required:true},
  title:{type:String, required:true},
  description:{type:String, required:true},
  price:{type:Number, required:true},
  sellerName:{
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String
}*/
    name: String,
    images: [{
        url:String,
        filename:String
    }],
    description: String,
    price: Number,
    placename: String,
    postcode: String,
    distance: Number,
   createdAt: { 
       type: Date, 
       default: Date.now 
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports=mongoose.model("Car",car);