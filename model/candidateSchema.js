import mongoose from "mongoose";
import url from "../database/connection.js";
 
mongoose.connect(url);
const CandidateSchema = mongoose.Schema({
name : {
    type : String,
    required : true
},
_id:{
    type:String,
    required:true
},
password:{
    type: String,
    required:true
},
gender:{
    type: String,
    required:true
},
dob:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true
},
contact:{
    type:String, 
    required:true
},
qualification:{
    type:String,
    required:true
},
percentage:{
    type:String,
    required:true
},
experience:{
    type:String,
    required:true
},
docs:{
    type:String,
    required:true
},
status:{
    type:Boolean,
    default:true,  
    required:true
},
adminVerify:{
    type:String,
    default:"Not verify",
    required:true
},
emailVerify:{
    type:String,
    default:"Not verify",
    required:true
}
});
export default mongoose.model('candidateSchema',CandidateSchema,'candidate');

