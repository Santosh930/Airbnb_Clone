const initData=require('./data.js');
const Listing=require('../models/listing.js');
const mongoose =require('mongoose');

const MONGO_URL="mongodb://127.0.0.1:27017/Airbnb-2";
main().then(()=>{
    console.log(`connected to DB`);
}).catch((error)=>{
    console.log(error);
})
 async function main(){

   await mongoose.connect(MONGO_URL);
};


const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj, owner:'66032dcc13f74e17554e8af3'

    }))
    await Listing.insertMany(initData.data);
    console.log('data was saved!');
}
initDB();


let str="66032dcc13f74e17554e8af3";
