const express=require('express');

const router=express.Router();
const multer  = require('multer');
const  {storage} =require('../cloudConfig.js')
const upload = multer({ storage})
const listingController=require('../controllers/listing.js');
//isLoggedin middleware
const {isLoggedIn}=require('../middleware.js');
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');
const {listingSchema,reviewSchema}=require('../schema.js');

//apply joi as a middleware

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};



//get and post route for route '/'

router.route('/')
.get(wrapAsync(listingController.allListings))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));



// new route
router.get('/new',isLoggedIn,listingController.renderNewForm );




//get put and delete route for route '/:id'

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync( listingController.destroyListing))





//creat route
// router.post('/', wrapAsync(async (req,res,next)=>{

//     try {

//     const newListing=new Listing(req.body.listing);
//     await newListing.save()
//    // console.log(newListing);
//     res.redirect('/listings');
    
        
//     } catch (error) {
//         next(error);
        
//     }

// }));


//edit route
router.get('/:id/edit',wrapAsync(listingController.renderEditForm));





module.exports=router;