const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

 
cloudinary.config({ 
    cloud_name: 'daeqwemkc', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
      cloudinary:cloudinary,
      params:{
        folder:"AutoTrader",
      allowedFormats:["jpg","jpeg","png","gif"]
      }
  });

  module.exports={
      cloudinary,
      storage
  }
