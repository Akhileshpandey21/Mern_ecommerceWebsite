import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js";
import OrderModel from "../models/OrderModel.js";
import JWT from 'jsonwebtoken';
import slugify from "slugify";

import fs from "fs";
import ProfileModel from "../models/ProfileModel.js";

export const registerController= async (req,res)=>{
  try{
   const {name,email,password,phone,address,answer}=req.body;  //destructring 
    //validations
    //mine |
  if(!name){
    return res.send({message:'Name is required'})
  }
  if(!email){
    return res.send({message:'Email is required'})
  }
  if(!password){
    return res.send({message:'Password is required'})
  }
  if(!phone){
    return res.send({message:'Phone no is required'})
  }
  if(!address){
    return res.send({message:'Address is required'})
  }
  if(!answer){
    return res.send({message:'Answer is required'})
  }

    //existing user checking because we don't want to  create a user with same email
    const existingUser=await userModel.findOne({email})//we can write {email} only
   if(existingUser){
    return res.status(200).send(
        {
            success:false,
            message:'Already register please login'
        }
    )
   }
   //register user
   const hashedPassword=await hashPassword(password)
   //save
    const user=await new userModel({name,
      email,
      phone,
      address,
      password:hashedPassword,
      answer,
    }).save()

    res.status(201).send({
        success:true,
        message:'User register Successfully',
        user
    })

  }
  catch(error){
    console.log(error);
   res.status(500).send({
    success:false,
    message:'Error in Registeration',
    error
   })
  }

}

// get all users creted by mine
export const getAllUsersController= async (req,res)=>{
  try{
   const users=await userModel.find();
   res.status(200).send({
    success: true,
    counTotal: users.length,
    message: "All Users ",
    users,
  });

  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting users",
      error: error.message,
    });

  }
}




// update user by mine
export const updateUserController=async(req,res)=> {
  try{
    let user=await userModel.findById(req.params.id)
    if(!user){
      return res.status(500).send({
        success:false,
        message:"User not Found",
  
      })
    }

    user=await userModel.findByIdAndUpdate(req.params.id,req.body,{
      new:true, runValidators:true,useFindAndModify:false
    });
    
    res.status(200).send({
      succes:true,
      message:"User updated successfully",
      user
    })
    
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in updating users",
      error: error.message,
    });
    
  }
}

// get user photo
export const profilePhotoController=async (req,res)=>{
  try {
    const profileImage = await ProfileModel.findById(req.params.id).select("photo");
    if (profileImage.photo.data) {
      res.set("Content-type", profileImage.photo.contentType);
      
      return res.status(200).send(profileImage.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }

}


//get all users with photo
export const getAllUsersPhotoController = async (req, res) => {
  try {
    const users = await ProfileModel
      .find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: users.length,
      message: "All Users ",
      users
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting users",
      error: error.message,
    });
  }
};

// get single user with photo
export const getSingleUserController = async (req, res) => {
  try {
    const user = await ProfileModel
      .findOne({_id:req.params.id })
      .select("-photo")
    res.status(200).send({
      success: true,
      message: "Single User Fetched",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single user",
      error,
    });
  }
};

//single user
export const getUserController = async (req, res) => {
  try {
    const user=await userModel.findById(req.params.id)
    res.status(200).send({
      success: true,
      message: "Single User Fetched",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single user",
      error,
    });
  }
};

// http://localhost:8080/api/v1/auth/register/user/info/single/643b69a777bfe0ec215e64e8






//delete
export const deleteUserController=async(req,res)=>{
  try{
    const user=await userModel.findByIdAndDelete(req.params.id)
    res.status(200).send({
      succes:true,
      message:"User deletd successfully",
    })
 
}
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in updating users",
      error: error.message,
    });

  }
}

// Profile //
export const profileController=async (req,res)=>{
   try{
    const {name,email,password,phone,address,role}=req.fields;
    const {photo}=req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !email:
        return res.status(500).send({ error: "Email is Required" });
      case !password:
        return res.status(500).send({ error: "Password is Required" });
      case !phone:
        return res.status(500).send({ error: "Phone is Required" });
      case !address:
        return res.status(500).send({ error: "Address is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }
    const profile= new ProfileModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      profile.photo.data = fs.readFileSync(photo.path);
      profile.photo.contentType = photo.type;
    }
    await profile.save();
    res.status(201).send({
      success: true,
      message: "Profile Created Successfully",
      profile,
    });


   }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in creating profile",
      error: error.message,
    });

   }    

} 












// post login

export const loginController=async (req,res)=>{
  try
  {
    const {email,password}=req.body
    //validation
    if(!email || !password){
      return res.status(404).send({
        success:false,
        message:'Invalid email or password'

      })
        
      }
      //check user
      const user=await userModel.findOne({email})
      if(!user){
        return res.status(404).send({
          success:false,
          message:'Email is not registered'
        })
      }
      const match=await comparePassword(password,user.password)

      if(!match){
        return res.status(200).send({
          success:false,
          message:'Invalid password'
        })
      }

      //token
      const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

      res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
          name:user.name,
          email:user.email,
          phone:user.phone,
          address:user.address,
          role:user.role

        },
        token
      })
  
  }catch(error){
   console.log(error)
   res.status(500).send({

    success:false,
    message:'error in login',
    error
   });
  }

}


//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};






//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};


//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};





