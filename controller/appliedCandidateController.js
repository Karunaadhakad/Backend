import { request, response } from "express";
import vacancySchema from "../model/vacancySchema.js";
import uuid4 from 'uuid4';
import appliedCandidateSchema from "../model/appliedCandidateSchema.js";

export const  candidateappliedVacancyController = async(request,response)=>{
    try{
         const appliedvacancyId = uuid4();
         const candidateData = JSON.parse(request.query.data);
      
         candidateData.appliedvacancyId = appliedvacancyId;
        //  console.log("candidateData",candidateData);
         const vacancyList = await vacancySchema.find();
         const status = await appliedCandidateSchema.create(candidateData);
         const candidateVacancyRecord = await appliedCandidateSchema.find({candidateEmail:request.payload.email});

         console.log(candidateVacancyRecord);
        //  response.render("candidateVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:"successfully applied",status:candidateVacancyRecord}); 
         
         response.status(200).send({status:true,email:request.payload.email,vacancyList:vacancyList,message:"Successfully Applied",vacancyStatus:candidateVacancyRecord});
        

        
            
            
    }catch(error){
      console.log("Error:",error);

    }
}