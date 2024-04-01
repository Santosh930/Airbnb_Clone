module.exports.isLoggedIn=(req,res,next)=>{
  // console.log(req.user,'Inside isLoggedIn middleware');
 
  // console.log(req.path,'....',req.originalUrl);
    if(!req.isAuthenticated()){
      //redirect to the originalUrl
      req.session.redirectUrl=req.originalUrl;
        req.flash('error','You have to must Logged In');

     return res.redirect('/login');
    }
    next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
 
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}