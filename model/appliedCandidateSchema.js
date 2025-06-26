import mongoose from 'mongoose';
import url from '../database/connection.js';

 
mongoose.connect(url);
const appliedCandidateSchema = mongoose.Schema({
  appliedvacancyId : {
    type : String,
    required:true
  },
  vacancyId : {
    type : String,
    required:true
  },
  candidateEmail:{
    type : String,
    required:true
  },
  recruiterEmail:{
    type : String,
    required:true
  },
  post:{
    type : String,
    required:true
  },
  recruiterStatus:{
    type : String,
    required:true,
    default:"Received"
  }

});

export default mongoose.model("appliedCandidateSchema",appliedCandidateSchema,'appliedVacancy');