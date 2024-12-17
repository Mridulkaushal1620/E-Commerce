const { default: mongoose } = require('mongoose');
const mongoURI = "mongodb://localhost:27017/e-commerce";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
}
module.exports = connectToMongo