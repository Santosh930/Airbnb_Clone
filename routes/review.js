const express=require('express');
const router=express.Router({mergeParams:true});
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema,listingSchema}=require('../schema.js');
const {isLoggedIn}=require('../middleware.js');
const reviewControllers =require('../controllers/review.js')
//schema validation for review
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

//routes for review

router.post('/',validateReview,wrapAsync(reviewControllers.createReview));

//delete review route
router.delete('/:reviewId',isLoggedIn,wrapAsync(reviewControllers.destroyReview));

module.exports=router;

