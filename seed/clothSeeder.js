var Cloth = require("../models/cloth");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/ecommerce_martss", {useNewUrlParser: true, useUnifiedTopology: true});
var clothes=[
new Cloth({
 imagePath:"https://m.media-amazon.com/images/I/7113XqJIZ9L._AC_UL640_FMwebp_QL65_.jpg",
 title: "Frock Dress",
 description: "Fashion trends are not only for the grown ups even the kids also go to do some fashion.",
 price: 549
}),
new Cloth({
    imagePath:"https://m.media-amazon.com/images/I/91RSg9Z-2fL._AC_UL640_QL65_.jpg",
    title: "Rayon a-line Casual Dress",
    description: "Beautiful printed dress features with cut and sew layering.Pair this beautiful dress with sneaker to complete the look.",
    price: 449
    }),
new Cloth({
        imagePath:"https://m.media-amazon.com/images/I/61w51NZz6JL._AC_UL640_QL65_.jpg",
        title: "Rayon a-line Casual Dress",
        description: "Highlighted with bold tropical prints, this sleeveless A-line dress is designed with a round neckline and a smocked waistline.",
        price: 699
        }),        
new Cloth({
        imagePath:"https://m.media-amazon.com/images/I/51FsZLRLICL._AC_SR320,400_.jpg",
        title: "Pepe Jeans Cotton Dress",
        description: "Innovative fabrics with interesting washes play an important role in creating the new age denim collection.",
        price: 749
        }),        
new Cloth({
        imagePath:"https://m.media-amazon.com/images/I/71fLWA-7cPL._AC_UL640_QL65_.jpg",
        title: "Women's Maxi Dress",
        description: "A beautifully collared, floaty dress features a ruffled overlay designed for ease",
        price: 1199
        }),        
new Cloth({
        imagePath:"https://m.media-amazon.com/images/I/71jMsgZfZ5L._AC_UL640_QL65_.jpg",
        title: "Round Neck Floral Print Flared Dress",
        description: "Allow girl to walk in style by wearing this flared dress presented by Life. It has been made of a good quality fabric.",
        price: 472
            }),                   
];
var done=0;
for(var i=0;i<clothes.length;i++)
clothes[i].save(function(err,result){
    done++;
    if(done==clothes.length)
    exit();
});
function exit()
{
    mongoose.disconnect();
}

