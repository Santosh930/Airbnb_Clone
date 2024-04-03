const Listing=require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

module.exports.allListings=async (req,res)=>{

    let allListings= await Listing.find({});
    // console.log(allListings);
    res.render('./listings/index.ejs',{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    
    res.render('./listings/new.ejs')

};
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;

    const listing=await  Listing.findById(id)
    .populate({path:'reviews',
populate:{
    path:'author',
},
})
    .populate('owner');
    // console.log(listing);
    // console.log(name);
    // console.log(req.params);
    if(!listing){
        req.flash('error','This Listing is not existing!');
        res.redirect('/listings');
    }



    res.render('./listings/show.ejs',{listing});



};


module.exports.createListing=async (req,res)=>{
   let response= await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1
      })
        .send();
        // console.log(response.body.features[0].geometry.coordinates);
        // res.send('done');
        
    const url=req.file.path;
    const filename=req.file.filename;
    // console.log(url);
    // console.log(filename);
    const newListing=new Listing(req.body.listing);
    //   if(!newListing.title){
    //         throw new ExpressError(400,'title is missing!');
    
    //     }
    //     if(!newListing.price){
    //         throw new ExpressError(400,'price is missing!');
    
    //     }
    //     if(!newListing.location){
    //         throw new ExpressError(400,'location is missing!');
    
    //     }
    //     if(!newListing.description){
    //         throw new ExpressError(400,'description is missing!');
    
    //     }
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    // console.log(savedListing);
    // apply flash
    req.flash('success','New Listing Created Successfully!');
   // console.log(newListing);
    res.redirect('/listings');

    

};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await  Listing.findById(id);
    if(!listing){
        req.flash('error','This Listing is not existing!');
        res.redirect('/listings');
    }
    let originalImageUrl=listing.image.url;
     originalImageUrl= originalImageUrl.replace("/upload","/upload/h_100,w_50");

    res.render('./listings/edit.ejs',{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    

    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file !== "undefined"){
    const url=req.file.path;
    const filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();

    }
    

    // apply flash
    req.flash('success','Listing updated successfully!');
    // console.log(update);

    res.redirect(`/listings/${id}`);

};

module.exports.destroyListing=async(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must have to login before crating a new listing!');
        res.redirect('/login');
    }
    let {id}=req.params;
   const deletedListing= await Listing.findByIdAndDelete(id);
//    console.log(deletedListing);
   // apply flash
   req.flash('success','Listing deleted successfully!');
   res.redirect('/listings');
    
};