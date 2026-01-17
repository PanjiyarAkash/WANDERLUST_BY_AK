const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>console.log("coonected to DB")) 
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://akashpanjiyar2004_db_user:fhHOYSy7NZ94ZTqT@cluster0.2eesgxr.mongodb.net/?appName=Cluster0');
}


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner: "6949474925cbf39c8a560099"})); // to update owner in data base
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();