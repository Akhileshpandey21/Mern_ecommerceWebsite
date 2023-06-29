import mongoose from "mongoose";

const reviewSchema=mongoose.Schema({
  name:{
    type:String,
  
  },
  rating:{
    type:Number,
  },
  comment:{
    type:String,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  }
})


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    review:[reviewSchema],
    rating:{
      type:Number,
     default:0
    },
    likes:{
      type:Number,
      default:0
    },
    numReviews:{
     type:Number,
      default:0
    },

    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
