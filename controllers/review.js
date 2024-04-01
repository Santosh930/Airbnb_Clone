const Listing=require('../models/listing');
const Review=require('../models/review');


module.exports.createReview=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // apply flash
    req.flash('success','New Listing review Created successfully!');
    // console.log('new reviews saved!');
    // res.send('new reviews saved!');
    res.redirect(`/listings/${id}`);
};


module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    // apply flash
    req.flash('success','Listing review deleted successfully!');
    
    res.redirect(`/listings/${id}`);
};