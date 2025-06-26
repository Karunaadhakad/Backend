import mongoose from "mongoose";
import url from "../database/connection.js";
 
mongoose.connect(url);

const AdminSchema = mongoose.Schema({
    email : {
        type : String,
        required :true
    },
    password : {
        type :String,
        required : true
    }
});

export default mongoose.model('adminSchema',AdminSchema,'admin');

















































