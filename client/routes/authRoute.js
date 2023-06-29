import express from "express";
import {
     registerController,
    loginController ,
    testController,
    forgotPasswordController,
    getOrdersController,
    updateProfileController,
    getAllOrdersController,
    orderStatusController,
    getAllUsersController,
    updateUserController,
    deleteUserController,
    profileController,
    profilePhotoController,
    getAllUsersPhotoController,
    getSingleUserController,
    getUserController,

} 
    from "../controllers/authController.js";

    import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
    import formidable from 'express-formidable'

//Router object:agr ham separate file me route karenge to router ka object create karenge

const router = express.Router();

//routing
//Register || method post

router.post('/register', registerController);

//rEgister with photo
router.post('/register/photo',formidable(),profileController)//mine

// get photo
router.get('/register/photo/:id',profilePhotoController)//mine


//-----get all users || post protected route || 
router.post('/register/users', getAllUsersController);

//-----get all users with photo || post protected route || 
router.post('/register/users/photo', getAllUsersPhotoController);

// get single user
router.post('/register/user/info/:id',getSingleUserController)

// get single user without phto
router.post('/register/user/info/single/:id',getUserController)

// update user || post protected route

router.put('/register/users/:id',updateUserController);

// delete user 
router.delete('/register/users/delete/:id',deleteUserController);

//-----

 

//LOGIN || POST
router.post('/login',loginController)
// router.post("/login",loginController)

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get('/test',requireSignIn ,isAdmin, testController)

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });
  //protected Admin route auth
  router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });
  
  
//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);


export default router; 







