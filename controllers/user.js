const User=require('../models/user');

module.exports.renderSignupForm=async (req,res)=>{
    res.render('users/signup.ejs');
};


module.exports.signup=async(req,res)=>{

    try {
    // console.log(req.body);
    let {username='santosh',email='santosh@gmail.com',password='abcde'}=req.body;
    // console.log(req.body);
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
          return  next(err);
        }
        // console.log(registeredUser);
    // apply flash
    req.flash('success','new user registered successfully!');
    
    res.redirect('/listings');
        
    })
    
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/signup');
        
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs')
};

module.exports.login=(req,res)=>{
    req.flash('success','Welcome to the Airbnb!');
    let redirectUrl=res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash('success','You are logout successfully!');
        res.redirect(`/listings`);
    });
}