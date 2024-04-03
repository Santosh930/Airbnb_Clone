



if(process.env.NODE_ENV != "production"){
require('dotenv').config()

}


const express=require('express');
const mongoose=require('mongoose');
const wrapAsync=require('./utils/wrapAsync.js');
// const MONGO_URL="mongodb://127.0.0.1:27017/Airbnb-2";
const dbUrl=process.env.ATLASDB_URL;
const app=express();


const flash=require('connect-flash');

const path=require('path');
app.set('views', path.join(__dirname, 'views'));
//database connectivity
main().then(()=>{
    console.log('Connected DB!');
}).catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect(dbUrl);

}
//expressError
const ExpressError=require('./utils/ExpressError.js');

//for using another method except get & post
const methodOverride=require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
//for apply express-session
const  session=require('express-session');
const MongoStore = require('connect-mongo');
const store=MongoStore.create({
mongoUrl:dbUrl,
crypto:{
    secret:process.env.SECRET,
},
touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in mongo session store",err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }

}

app.use(session(sessionOptions));
//for connect-flash message

app.use(flash());
app.use((req,res,next)=>{

    
    
    // console.log(res.locals.currUser,'Inside middleware');
    // console.log(req.user,'Inside middleware');
    // console.log(req.session.passport);

    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.session.passport;
   
    next();
});
//home route
app.get('/',wrapAsync((req,res)=>{
    
    req.flash('success','Welcome to the home page of Airbnb!');
    res.render("./listings/home.ejs");
    
}));

//for signup/login using passport
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
app.use(passport.initialize());
app.use(passport.session());//session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:'raman@gmail.com',
//         username:'raman',
//     });
//     let registeredUser=await User.register(fakeUser,'helloworld');
//     res.send(registeredUser);
// });

//user router
const userRouter=require('./routes/user.js');
app.use('/',userRouter);

//listing router
const listingRouter=require('./routes/listing.js');
app.use('/listings',listingRouter);

//review router
const reviewRouter=require('./routes/review.js');
app.use('/listings/:id/reviews',reviewRouter);

//for applying css
app.use(express.static('public'));

//for ejs-mate template
const ejsMate=require('ejs-mate');

app.engine('ejs',ejsMate);

//inserting sample data in db...

// app.get('/testData', async   (req,res)=>{

// let listing=new model.User({
//     title:"The palace",
//     description:"The place is good!",
//     image:'',
//     price:1200,
//     location:'Delhi',
//     country:'India',

// });
//     await listing.save();
//     console.log(listing);

//     res.send("Data was successfully saved!");


// });

//all route
app.all('*',(req,res,next)=>{
    
    next(new ExpressError(404,'Page Not Found!'));
});


//middle ware for custom error handling
app.use((error,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=error;
    // console.log(statusCode);
    // console.log(message);
    // res.status(statusCode).send(message);
    res.status(statusCode).render('./listings/err.ejs',{error});
})

app.listen(8080,()=>{
    console.log('server is running on port 8080');
})