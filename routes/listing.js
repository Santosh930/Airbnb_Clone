const express=require('express');

const router=express.Router();
const multer  = require('multer');
const  {storage} =require('../cloudConfig.js')
const upload = multer({ storage})
const listingController=require('../controllers/listing.js');
//isLoggedin middleware
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const wrapAsync=require('../utils/wrapAsync');
//get and post route for route '/'

router.route('/')
.get(wrapAsync(listingController.allListings))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));



// new route
router.get('/new',isLoggedIn,listingController.renderNewForm );




//get put and delete route for route '/:id'

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync( listingController.destroyListing))





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