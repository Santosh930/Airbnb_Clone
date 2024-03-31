const express=require('express');
const router=express.Router();

const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl}=require('../middleware.js');
const userController=require('../controllers/user.js');


//get and post rout for /signup
router.route('/signup')
.get(wrapAsync(userController.renderSignupForm ))
.post(wrapAsync(userController.signup))

//get and post route for login
router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.login)


//get route for logout
router.get('/logout',userController.logout);
module.exports=router;

