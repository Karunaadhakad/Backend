import mongoose from "mongoose";
import url from "../database/connection.js";
 
mongoose.connect(url);

const VacancySchema = mongoose.Schema({
    vacancyId: {
        type : String,
        required :true
    },
    post: {
        type : String,
        required :true
    },
    subject: {
        type :String,
        required : true
    },
    location: {
        type :String,
        required : true
    },
    criteria:{
        type :String,
        required : true
    },
    experience: {
        type :String,
        required : true
    },
    mode:{
        type :String,
        required : true
    },
    vacancy:{
        type :Number,
        required : true
    },
    salary:{
        type :Number,
        required : true
    },
    advDate:{
        type :Date,
        required : true,
       
    },
    lastDate:{
        type :Date,
        required : true,
       
    },
    email:{
        type :String,
        required : true
    },
    recruiter:{
        type :String,
        required : true
    },
    name:{
        type:String,
        required : true
    }
});

export default mongoose.model('vacancySchema',VacancySchema,'vacancy');

















































