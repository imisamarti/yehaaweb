var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   location: String,
   cost: Number,
   createAt: {type:Date, default:Date.now},
   author: {
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
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
    }
});
 
module.exports = mongoose.model("Campground", campgroundSchema);