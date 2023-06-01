const mongoose=require('mongoose')
mongoose.set('strictQuery', false);
const server='127.0.0.1:27017'
const database='olx'
MONGO_URL='mongodb+srv://sajadabbasi55:A3ehb1t9g_@cluster0.zvl16zu.mongodb.net/sellopoint?retryWrites=true&w=majority'
const DB=()=>{
  try {
    // Connect to the MongoDB cluster
    //  mongoose.connect(`mongodb://${server}/${database}`),
    //   console.log(`server is connected on localhost`)
     mongoose.connect(MONGO_URL),
       console.log("over internet connected")

  } catch (e) {
    console.log("could not connect");
  }
}
// export default DB
module.exports=DB