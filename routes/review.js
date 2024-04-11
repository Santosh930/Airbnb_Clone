const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const reviewControllers =require('../controllers/review.js')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');

//routes for review

router.post('/',isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));

//delete review route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports=router;

